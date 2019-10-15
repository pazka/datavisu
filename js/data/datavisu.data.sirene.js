//https://opendata.paris.fr/explore/dataset/sirene-disponibilite-en-temps-reel/information/
class DataSirene extends Data{
    size;
    colors;
    type = "Sirene"

    constructor(rawData,date,life,x,y,_size = 15){
        super(rawData,date,life,x,y);
        this.size = _size;
        this.colors=
        Array.from(Array(2 + Math.round(rdm()*5)).keys()).map(i=>[rdm()*255, rdm()*255, rdm()*255])
    }

    draw(p){
        let x = (this.age/this.life);
        // drawTarget(p,this.pos.x, this.pos.y, this.size, 10, [255,250,50], 255*(1-Math.abs((0.5-x)*2))); // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=100-\frac{x}{110-x}\cdot10
        /*drawTargetBis(p,
        this.pos.x + (- 2 + rdm()*5),
        this.pos.y + (- 2 + rdm()*5),
        this.size,
        this.colors.length,
        this.colors,
         255-x);

*/  //       drawStar(p,this.pos.x, this.pos.y, 1,vs(this.noise*this.noise*100)*50*easeInOut(x),this.noise, 
     //    [vs(100)*127+vc(100)*127,vs(200)*127+vc(300)*127,vs(300)*127+vc(600)*127, 255*easeInOut(x)]) // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=100-\frac{x}{110-x}\cdot10

        // p.fill(100);
       // p.text(Math.round(x),this.pos.x,this.pos.y-30)
        super.draw(p);
    }
}

class Sirene extends DataType{
    type = "Sirene";
    static get avgLife(){return  _dataMngr.datesBounds.totalTimeLength /100 };
    static get json () { return  import_sirene_json}
    __dateBounds = null
    static get dateBounds () { return  this.__dateBounds}
    static set dateBounds (e) { this.__dateBounds = e}

    static preloadData(){
        Sirene.nbData = Sirene.json.length
    }

    static getDateBounds(){
        if(Sirene.dateBounds != null)
            return Sirene.dateBounds

        let dateBounds = {minDate : Infinity, maxDate : 0}

        Sirene.json.forEach(data =>{
            
            let tmp_d =  new Date(data.properties.DCRET.substring(0,4),data.properties.DCRET.substring(4,6),data.properties.DCRET.substring(6,8)).getTime() ;


            if(tmp_d < dateBounds.minDate){
                dateBounds.minDate = tmp_d;
            }
            if(tmp_d > dateBounds.maxDate){
                dateBounds.maxDate = tmp_d;
            }
        });
        dateBounds.dateSpan = dateBounds.maxDate - dateBounds.minDate;
        Sirene.dateBounds = dateBounds
        return dateBounds;
    }

    static browse(fn){
        Sirene.json.forEach(data =>{
            let pos_tmp = [
                _map.getX(data.geometry.coordinates),
                _map.getY(data.geometry.coordinates)
            ]

            let tmp_d = _dataMngr.getRelTime(new Date(data.properties.DCRET.substring(0,4),data.properties.DCRET.substring(4,6),data.properties.DCRET.substring(6,8)).getTime());
            fn(
                
                new DataSirene(data,
                    tmp_d,
                    Sirene.avgLife,
                    pos_tmp[0],
                    pos_tmp[1],
                    19)
            );
        });
    }
}