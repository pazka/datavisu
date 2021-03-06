
let _filterNumber = 6
let _nb = 0

class DataManager {
    allDataToDisplay1 = [];
    allDataToDisplay2 = [];
    allDataToDisplay = this.allDataToDisplay1;
    swap = false;

    nbDataDrawn = 0;

    //time vars
    time_start = 0;
    phase_time_elapsed = 0;
    //phases = [{totalTimeLength : 0.5 * 1000},{totalTimeLength : 0.5 * 1000},{totalTimeLength : 1 * 0.5 * 1000}]
    datesBounds = {
        /// titme total for animation in milliseconds
        totalTimeLength: 2 * 60 * 1000,
        maxDate: 0,
        minDate: Infinity,
        _typedMinDate: 0,
        _typedMaxDate: 0,
        dateSpan: 0
    }


    constructor(allDataTypes) {
        this.allDataTypes = allDataTypes
        this.allDataTypes.forEach(type => {
            type.preloadData()
        });
    }

    //phase init at 0 for init purpose
    phases = [
        {
            totalTimeLength: 2 * 60 * 1000,
            action: () => {
                Ril.browse((bat) => {
                    _dataMngr.addData(bat);
                })
            }
        }/*,
        {
            totalTimeLength : 2 * 60 * 1000,
            action: ()=>{ 
                Sirene.browse((comm) => {
                    _dataMngr.addData(comm);
                })
            }
        },/*{
            totalTimeLength : 2 * 60 * 1000,
            action: ()=>{ 
                Air.browse((storm) => {
                    _dataMngr.addData(storm);
                })
            }
        }*/
    ]

    phase = -1;

    loadDates() {
        // let loadProg = document.getElementById('loading-progress');
        //set data timing
        this.datesBounds.totalTimeLength = this.phases[this.phase] ? this.phases[this.phase].totalTimeLength : 0;
        if (this.phases[this.phase] != undefined) this.phases[this.phase].action();
    }

    updateDateBounds() {
        this.datesBounds = this.datesBounds ? this.datesBounds : { maxDate: 0, minDate: Infinity };


        let newBounds
        this.allDataTypes.forEach(dataType => {

            newBounds = dataType.getDateBounds();
            if (newBounds.minDate < this.datesBounds.minDate) {
                this.datesBounds.minDate = newBounds.minDate;
                this.datesBounds._typedMinDate = new Date(this.datesBounds.minDate);
            }
            if (newBounds.maxDate > this.datesBounds.maxDate) {
                this.datesBounds.maxDate = newBounds.maxDate;
                this.datesBounds._typedMaxDate = new Date(this.datesBounds.maxDate);

            }
            this.datesBounds.dateSpan = this.datesBounds.maxDate - this.datesBounds.minDate;
        })
    }
    resetDateBounds() {
        this.datesBounds = { maxDate: 0, minDate: Infinity };


        let newBounds
        this.allDataTypes.forEach(dataType => {

            newBounds = dataType.getDateBounds();
            if (newBounds.minDate < this.datesBounds.minDate) {
                this.datesBounds.minDate = newBounds.minDate;
                this.datesBounds._typedMinDate = new Date(this.datesBounds.minDate);
            }
            if (newBounds.maxDate > this.datesBounds.maxDate) {
                this.datesBounds.maxDate = newBounds.maxDate;
                this.datesBounds._typedMaxDate = new Date(this.datesBounds.maxDate);

            }
            this.datesBounds.dateSpan = this.datesBounds.maxDate - this.datesBounds.minDate;
        })
    }


    drawData() {
        //draw
        let i = 0;
        this.nbDataDrawn = 0;

        //drawing by swapping array to clean them
        this.allDataToDisplay = this.swap ? this.allDataToDisplay2 : this.allDataToDisplay1

        this.allDataToDisplay.forEach(data => {
            if (data.age > 0) {
                this.nbDataDrawn++
                _p.push()
                data.draw(_p)
                _p.pop()
            }
            //clean
            if (!data.hasLived) {
                if (this.swap)
                    this.allDataToDisplay1.push(data)
                else
                    this.allDataToDisplay2.push(data)
            }

            i++
        });
        if (this.swap)
            this.allDataToDisplay2 = []
        else
            this.allDataToDisplay1 = []

        this.swap = !this.swap

        //loop
        if (this.getTimeRef() > this.datesBounds.totalTimeLength || this.allDataToDisplay.length == 0) {
            this.newPhase();
        }
    }

    addData(data) {
        if (this.swap)
            this.allDataToDisplay2.push(data)
        else
            this.allDataToDisplay1.push(data)
    }

    getRelTime(t, dataBounds) {
        if (!dataBounds) {
            dataBounds = this.datesBounds
        }

        if (!dataBounds.minDate || !dataBounds.maxDate) {
            throw new Error("dateBounds have no valid limits")
        }

        let pos = (t - dataBounds.minDate) / (dataBounds.maxDate - dataBounds.minDate)

        return Math.round(pos * dataBounds.totalTimeLength)
    }



    getTimeRef() {
        // return _p.millis();
        // * 1000 cause We want it in milliseconds
        return (_p.frameCount / _frameRate * 1000) - this.time_start;
    }

    startTime() {
        this.time_start = (_p.frameCount / _frameRate * 1000);
    }

    newPhase() {
        this.allDataToDisplay = [];
        this.allDataToDisplay1 = [];
        this.allDataToDisplay2 = [];

        //TODO faire ça propre
        this.datesBounds.totalTimeLength = this.phases[this.phase] ? this.phases[this.phase].totalTimeLength : 0;
        this.phase_time_elapsed += this.phases[this.phase] ? this.phases[this.phase].totalTimeLength : 0;
        this.phase++;

        if (this.isEnded) {
            this.phase = 0;
            this.phase_time_elapsed = 0;

            if (_isCapturing ) {
                try {
                    _capturer.stop()
                    _capturer.save()
                } catch (error) {
                    console.log(error);
                }

                //to completely stop the engine
                this.phase = this.phases.length + 1
                _stop = true
            }
        }

        if (_stop)
            return

        this.startTime()
        this.loadDates()

        return this.phase >= this.phases.length
    }

    get isEnded() {
        return this.phase >= this.phases.length
    }
    isPhase(phase) {
        return this.phase == phase
    }

    getCurrentProjectedDate() {
        let ratio = (_dataMngr.getTimeRef() - this.time_start) / this.datesBounds.totalTimeLength;
        return new Date(this.datesBounds.minDate + ratio * this.datesBounds.dateSpan);
    }
}

class Data {
    rawData
    life = 0;
    born;
    date;
    pos = {
        x: 0,
        y: 0
    }
    noise = 1 + rdm() * 50
    get varNoise() {
        return
    }

    constructor(rawData, _date, _life = 10, _x, _y) {
        this.rawData = rawData
        this.life = _life; // in millisecond
        this.born = _date; // time born 
        this.pos = {
            x: _x,
            y: _y
        }
        this.date = _date;
    }

    get hasLived() {
        return _dataMngr.getTimeRef() - this.born >= this.life;
    }

    get age() {
        return _dataMngr.getTimeRef() - this.born;
    }

    draw(p) {

        let x = (this.age / this.life);
        stupidCircle(p, this.pos.x, this.pos.y, 20, [155, 155, 155])

        /*drawStar(p,this.pos.x, this.pos.y, this.noise/2,200*x,this.noise, [
            0,
            0, 
            110 + 40*x,
            255*easeInOut(x)]);
            */

        // drawStar(p,this.pos.x, this.pos.y, 1,vs(this.noise*100)*100*easeInOut(x),this.noise, [
        //     vs(100)*127+vc(100)*127,
        //     vs(200)*127+vc(300)*127,
        //     vs(300)*127+vc(600)*127, 
        //     255*easeInOut(x)]); // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=100-\frac{x}{110-x}\cdot10
        //    "a"+p.text(Math.round(this.age )+ " b" + Math.round(this.born) + " d"+ Math.round(this.date)+ " ", this.pos.x,this.pos.y);
    }
}

class DataType {
    static get type() { return "None" }
    _nbData = 0
    static get nbData() { return this._nbData }
    static set nbData(n) { this._nbData = n }

    static globalDraw(p, data) {
        throw type + ": globalDraw : This function is not implemented"
    }

    static getDateBounds() {
        throw type + ": getBounds : This function is not implemented"
    }

    static browse() {
        throw type + ": browse : This function is not implemented"
    }

    static exclude(data) {
        return !isInsidePoly(data, _map.screenBounds.points)
    }
}