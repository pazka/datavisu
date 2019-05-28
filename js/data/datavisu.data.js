class DataManager{
    allData = [];
    allDataToDisplay = [];
    _dataIndexToClean = [];
    time_start = 0;

    //phase init at 0 for init purpose
    phase = 0;
    nbPhase = 3;

    datesBounds = {
        /// titme total for animation in milliseconds
        totalTimeLength : 2 * 60 * 1000,
       // totalTimeLength : 6000,
        maxDate : 0,
        minDate : Infinity,
        _typedMinDate :0,
        _typedMaxDate : 0,
        dateSpan : 0
    }

    loadDates() {
        let loadProg = document.getElementById('loading-progress');
        //set data timing
        
        if(_dataMngr.isPhase(1)){
            _flock.boids=myBoids
            Traveler.browse(import_traveler_json, (travel) => {
                _dataMngr.addData(travel);
            })
        }else{
            _flock.boids=[]
        }
    
        if(_dataMngr.isPhase(2)){
            Elec.browse(import_elec_json, (elec) => {
                _dataMngr.addData(elec);
            })
        
        
            Renc.browse(import_renc_json, (renc) => {
                _dataMngr.addData(renc);
            })
        }
        
        if(_dataMngr.isPhase(3)){
            Velib.browse(import_velib_json, (velib) => {
                _dataMngr.addData(velib);
            })
    
            Event.browse(import_event_json, (event) => {
                _dataMngr.addData(event);
            })
    
            Cafe.browse(import_cafe_json, (cafe) => {
                _dataMngr.addData(cafe);
            })
        }
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
                data.draw(_p);

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
        if(this.getTimeRef() > this.datesBounds.totalTimeLength + Velib.avgLife){
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
       return ( _p.frameCount / _frameRate * 1000 ) - this.time_start;
    }

    startTime(){
        this.time_start = ( _p.frameCount / _frameRate * 1000 );
    }

    newPhase(){
        //TODO faire ça propre
        this.phase = this.phase +1;
        if(this.isEnded){
            this.phase = 1;

            if(_isCapturing){
                _capturer.save()
                this.phase = 5
                _stop = true
            }
        }

        this.startTime()
        this.loadDates()

        return  this.phase > this.nbPhase
    }

    get isEnded(){
        return this.phase > this.nbPhase
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
        drawStar(p,this.pos.x, this.pos.y, 1,vs(this.noise*100)*100*easeInOut(x),this.noise, [vs(100)*127+vc(100)*127,vs(200)*127+vc(300)*127,vs(300)*127+vc(600)*127, 255*easeInOut(x)]); // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=100-\frac{x}{110-x}\cdot10
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