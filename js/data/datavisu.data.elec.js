//https://opendata.paris.fr/explore/dataset/bornes-de-recharge-pour-vehicules-electriques/information/
class DataElec extends Data{
    size
    allDataMask 
    backColor
    shader
    
    //circle visu
    dataCircles
    circlesNumbers
    circleCurrentPosition
    circleSpeed
    circleCurSpeed
    trail

    constructor(date,life,circlesNumbers = 10,circleSpeed = 2){
        super(date,life,0,0);

        this.circleSpeed = circleSpeed;
        this.circlesNumbers = circlesNumbers;
        this.allDataMask = _p.createImage(_p.width,_p.height);
        this.dataCircles = [[]];    
        this.circleCurrentPosition = 0;
        this.circleCurSpeed = 0;

     //   this.backColor = _p.createImage(_map.dimension.width,_map.dimension.height);
    }

    draw(p){


        //p.image(this.dataMask,0,0);
        this.dataCircles[this.circleCurrentPosition].forEach(coords => {
            drawTarget(_p,coords[0],coords[1],3,5,[255,200,55],vs1(500)*255);
        });

        //update currentcircle if speed has donne loop
        this.circleCurSpeed = (this.circleCurSpeed+1) % this.circleSpeed

        if(this.circleCurSpeed == 0)
            this.circleCurrentPosition = (this.circleCurrentPosition+ 1)% this.circlesNumbers;
    }
}

let _singleElecData;

class Elec extends DataType{
    type = "Elec";

    static browse(json,fn){
        if(_singleElecData == undefined){
            //instantiate elec
            _singleElecData = new DataElec(_dataMngr.getTimeRef(),_dataMngr.datesBounds.totalTimeLength);
          //  let tmpGraph =  _p.createGraphics(_p.width,_p.height);
            let coords;
            _singleElecData.dataCircles = [];
            for (let i = 0; i < _singleElecData.circlesNumbers; i++) {
                _singleElecData.dataCircles.push([]);
            }

            //fill single data visualisation
            
            let center  = [_p.width/2,_p.height/2]
            let radius = ((_map.dimension.height/1.5)/_singleElecData.circlesNumbers);
            json.forEach(data =>{
                if(Elec.exclude(data))
                    return;
                
                coords = [_map.getX(data.geometry.coordinates[0]),_map.getY(data.geometry.coordinates[1])]; 

                //prepare cirecle of data
                for (let i = 0; i < _singleElecData.circlesNumbers; i++) {
                    
                    if(isInsideCircles(coords,center,radius * i,radius * (i+1)))
                        _singleElecData.dataCircles[i].push(coords);
                }

                //draw the mask inside the elecdata
            //    drawTarget(tmpGraph,coords[0],coords[1],15,30,[100,100,255],100);
            });

            //store or data graphic
           // _singleElecData.allDataMask.copy(tmpGraph,0,0,tmpGraph.width,tmpGraph.height,0,0,tmpGraph.width,tmpGraph.height);*/
        }
        
        //give back the ref of the data to draw to dataMngr
        fn(
            _singleElecData
        );
    }

    static exclude(data){
        return false;
    }
}