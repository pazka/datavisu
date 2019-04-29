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

    constructor(date,life,circlesNumbers = 60,circleSpeed = 2){
        super(date,life,0,0);

        this.circleSpeed = circleSpeed;
        this.circlesNumbers = circlesNumbers;
        this.allDataMask = _p.createImage(_p.width,_p.height);
        this.dataCircles = [[]];    
        this.circleCurrentPosition = 0;
        this.circleCurSpeed = 0;

     //   this.backColor = _p.createImage(_map.dimension.width,_map.dimension.height);
     //   this.shader.set("u_resolution", _p.width * 1.0, _p.heigh * 1.0 );
    }

    hasLived(){
        super.hasLived();
    }

    draw(p){
      /*  this.shader.set("u_time", millis() / 1000.0);
        
        p.shader(this.shader);
        p.rect(0,0,p.width,p.height);

        this.backColor.loadPixels();
        let pix = this.backColor.pixels;
       /* for (let i = 0; i < pix.length; i += 4) {
            pix[i] = p.abs(p.cos(i*p.millis()))*50;
            pix[i+1] =  p.abs(p.sin(i*p.millis()))*100;
            pix[i+2] =  200+p.abs(p.sin(i*p.millis()))*55;
        }
        this.backColor.pixels = pix;
        
        this.backColor.mask(this.dataMask); 
        */   


        //p.image(this.dataMask,0,0);
            this.dataCircles[this.circleCurrentPosition].forEach(coords => {
                drawTarget(_p,coords[0],coords[1],15,5,[100,100,255],255);
            });


        this.circleCurrentPosition = (this.circleCurrentPosition+ (this.circleCurSpeed++ % this.circleSpeed == 0 ?1 : 0)) % this.circlesNumbers;
    }
}

let _singleElecData;

class Elec extends DataType{
    type = "Elec";

    static browse(json,fn){
        if(_singleElecData == undefined){
            //instantiate elec
            _singleElecData = new DataElec( _dataMngr.time_start,_dataMngr.datesBounds.totalTimeLength);
            let tmpGraph =  _p.createGraphics(_p.width,_p.height);
            let coords;
            _singleElecData.dataCircles = [];
            for (let i = 0; i < _singleElecData.circlesNumbers; i++) {
                _singleElecData.dataCircles.push([]);
            }

            //fill single data visualisation
            
            let center  = [_p.width/2,_p.height/2]
            let radius = ((_map.dimension.width/2)/_singleElecData.circlesNumbers);
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
                drawTarget(tmpGraph,coords[0],coords[1],15,30,[100,100,255],100);
            });

            //store or data graphic
           // _singleElecData.allDataMask.copy(tmpGraph,0,0,tmpGraph.width,tmpGraph.height,0,0,tmpGraph.width,tmpGraph.height);
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