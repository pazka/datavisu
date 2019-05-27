class DataManager{
    allData = [];
    allDataToDisplay = [];
    _dataIndexToClean = [];
    time_start;
    
    datesBounds = {
        /// titme total for animation in milliseconds
        totalTimeLength : 3 * 60000,
        maxDate : 0,
        minDate : Infinity,
        _typedMinDate :0,
        _typedMaxDate : 0,
        dateSpan : 0
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
       return _p.frameCount / _frameRate * 1000;
    }

    timeStart(){
        this.time_start = _dataMngr.getTimeRef();
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