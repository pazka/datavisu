class DataManager{
    allData = [];
    allDataToDisplay = [];
    dataToClean = [];
    time_start;
    
    datesBounds = {
        totalTimeLength : 3 * 60000,
        maxDate : 0,
        minDate : 99999999999999,
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
        this.allDataToDisplay.forEach(data => {
            data.draw(_p);
            if(data.hasLived())
                this.dataToClean.push(data);
        });

        //clean
        this.dataToClean.forEach(data => {
            this.allDataToDisplay.splice(this.allDataToDisplay.indexOf(data),1);
        });
        this.dataToClean = [];
    }

    addData(data){
        this.allDataToDisplay.push(data);
    }

    getRelTime(t,dataBounds){
        let pos = (t -  this.datesBounds.minDate) / (this.datesBounds.maxDate - this.datesBounds.minDate);
        
        return Math.round(pos* this.datesBounds.totalTimeLength);
    }

    timeStart(){
        this.time_start = _p.millis();
    }
    
    getCurrentProjectedDate(){
        let ratio = (_p.millis() - this.time_start )/this.datesBounds.totalTimeLength;
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

    hasLived(){
        return _p.millis() - this.born >= this.life;
    }

    get age (){
        return _p.millis() - this.born;
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

    static exclude(){
        throw type + ": exclude : This function is not implemented"
    }
}