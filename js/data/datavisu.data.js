
let _filterNumber = 6
let _nb = 0

class DataManager{
    allDataToDisplay = [];
    _dataIndexToClean = [];

    //time vars
    time_start = 0;
    phase_time_elapsed = 0;
    phases = [{totalTimeLength : 0.5 * 60 * 1000},{totalTimeLength : 1 * 60 * 1000},{totalTimeLength : 2.5 * 60 * 1000}]
    //phases = [{totalTimeLength : 0.5 * 1000},{totalTimeLength : 0.5 * 1000},{totalTimeLength : 1 * 0.5 * 1000}]
    datesBounds = {
        /// titme total for animation in milliseconds
        totalTimeLength : 2 * 60 * 1000,
        totalPhasesTimeLength : this.phases.reduce((a,b) => a+b.totalTimeLength,0),
        maxDate : 0,
        minDate : Infinity,
        _typedMinDate :0,
        _typedMaxDate : 0,
        dateSpan : 0
    }

    //phase init at 0 for init purpose
    phase = -1;
    nbPhase = 1;
    phasesActions = [
        /*()=>{ //phase 1
            _map.opacity = 10
            _flock.setup()

            Traveler.browse(import_traveler_json, (travel) => {
                _dataMngr.addData(travel);
            })
        },
        ()=>{ //phase 2
            _map.opacity = 100
            _flock.hide()
            Elec.browse(import_elec_json, (elec) => {
                _dataMngr.addData(elec);
            })
        
        
            Renc.browse(import_renc_json, (renc) => {
                _dataMngr.addData(renc);
            })
        },*/()=>{//phase 3
            Velib.browse(import_velib_json, (velib) => {
                _dataMngr.addData(velib);
            })}/*
    
            Event.browse(import_event_json, (event) => {
                _dataMngr.addData(event);
            })
    
            Cafe.browse(import_cafe_json, (cafe) => {
                _dataMngr.addData(cafe);
            })
        },()=>{ //phase 4 ?
            Sound.browse(import_sound_json, (storm) => {
                _dataMngr.addData(storm);
            })
        }*/
    ]

    loadDates() {
       // let loadProg = document.getElementById('loading-progress');
        //set data timing
        this.datesBounds.totalTimeLength = this.phases[this.phase].totalTimeLength
        if(this.phasesActions[this.phase] != undefined ) this.phasesActions[this.phase]();
    }

    updateBounds(newBounds){
        if(newBounds.minDate < this.datesBounds.minDate){
            this.datesBounds.minDate = newBounds.minDate;
            this.datesBounds._typedMinDate = new Date(this.datesBounds.minDate);
        }
        if(newBounds.maxDate > this.datesBounds.maxDate){
            this.datesBounds.maxDate = newBounds.maxDate;
            this.datesBounds._typedMaxDate = new Date(this.datesBounds.maxDate);

        }
        this.datesBounds.dateSpan = this.datesBounds.maxDate- this.datesBounds.minDate;
    }
    

    drawData(){
        //draw
        let i = 0;
        this.allDataToDisplay.forEach(data => {
            if(data.age > 0){
                _p.push()
                data.draw(_p)
                _p.pop()

                if(data.hasLived)
                    this._dataIndexToClean.push(i);
            }
            i++
        });
        

        //clean
        this._dataIndexToClean.forEach(dataIndex => {
            this.allDataToDisplay.splice(dataIndex,1);
        });
        this._dataIndexToClean = [];

        //loop
        if(this.getTimeRef() > this.datesBounds.totalTimeLength && this.allDataToDisplay.length == 0){
            this.newPhase();
        }
    }

    addData(data){
        this.allDataToDisplay.push(data);
    }

    getRelTime(t,dataBounds){
        let pos = (t -  this.datesBounds.minDate) / (this.datesBounds.maxDate - this.datesBounds.minDate);
        
        return Math.round(pos* this.datesBounds.totalTimeLength);
    }



    getTimeRef(){
       // return _p.millis();
       // * 1000 cause We want it in milliseconds
       return ( _p.frameCount / _frameRate * 1000 ) - this.time_start;
    }

    startTime(){
        this.time_start = ( _p.frameCount / _frameRate * 1000 );
    }

    newPhase(){
        //TODO faire ça propre
        this.phase_time_elapsed += this.phases[this.phase] ? this.phases[this.phase].totalTimeLength : 0;
        this.phase++;

        if(this.isEnded){
            this.phase = 0;
            this.phase_time_elapsed = 0;

            if(_isCapturing){
                _capturer.stop()
                _capturer.save()
                this.phase = this.nbPhase+1
                _stop = true
            }
        }

        if(_stop)
            return

        this.startTime()
        this.loadDates()

        return  this.phase >= this.nbPhase
    }

    get isEnded(){
        return this.phase >= this.nbPhase
    }
    isPhase(phase){
        return this.phase == phase
    }
    
    getCurrentProjectedDate(){
        let ratio = (_dataMngr.getTimeRef() - this.time_start )/this.datesBounds.totalTimeLength;
        return new Date(this.datesBounds.minDate + ratio * this.datesBounds.dateSpan);
    }
}

class Data{
    life = 0;
    born;
    date;
    pos = {
        x : 0,
        y : 0
    }
    noise = 1 + rdm()*99

    constructor(_date,_life = 10,_x,_y){
        this.life = _life; // in millisecond
        this.born = _date; // time born 
        this.pos = {
            x : _x,
            y : _y
        }
        this.date = _date;
    }

    get hasLived(){
        return _dataMngr.getTimeRef() - this.born >= this.life;
    }

    get age (){
        return _dataMngr.getTimeRef() - this.born;
    }

    draw(p){       
        
        let x = (this.age/this.life);
        drawStar(p,this.pos.x, this.pos.y, 1,10,this.noise, [
            vs(100)*127+vc(100)*127,
            vs(200)*127+vc(300)*127,
            vs(300)*127+vc(600)*127, 
            255*easeInOut(x)]);
        // drawStar(p,this.pos.x, this.pos.y, 1,vs(this.noise*100)*100*easeInOut(x),this.noise, [
        //     vs(100)*127+vc(100)*127,
        //     vs(200)*127+vc(300)*127,
        //     vs(300)*127+vc(600)*127, 
        //     255*easeInOut(x)]); // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=100-\frac{x}{110-x}\cdot10
       // stupidCircle(p,this.pos.x,this.pos.y,20,[155,155,155])
    //    "a"+p.text(Math.round(this.age )+ " b" + Math.round(this.born) + " d"+ Math.round(this.date)+ " ", this.pos.x,this.pos.y);
    }
}

class DataType{
    type = "none";

    static getBounds(){
        throw type + ": getBounds : This function is not implemented"
    }

    static browse(){
        throw type + ": browse : This function is not implemented"
    }

    static exclude(data){
        return !isInsidePoly(data,_map.screenBounds.points)
    }
}