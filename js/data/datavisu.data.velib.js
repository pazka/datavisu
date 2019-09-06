//https://opendata.paris.fr/explore/dataset/velib-disponibilite-en-temps-reel/information/
class DataVelib extends Data{
    size;
    colors;
    type = "Velib"

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

*/ //        drawStar(p,this.pos.x, this.pos.y, 1,vs(this.noise*this.noise*100)*50*easeInOut(x),this.noise, 
//         [vs(100)*127+vc(100)*127,vs(200)*127+vc(300)*127,vs(300)*127+vc(600)*127, 255*easeInOut(x)]) // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=100-\frac{x}{110-x}\cdot10

        // p.fill(100);
       // p.text(Math.round(x),this.pos.x,this.pos.y-30)
        super.draw(p);
    }
}

class Velib extends DataType{
    type = "Velib";
    static get avgLife(){return  _dataMngr.datesBounds.totalTimeLength / 100};

    static getBounds(json,dateBounds){
        json.forEach(data =>{
            if(Velib.exclude(data))
                return;

            let tmp_d =  data.fields.duedate ;


            if(tmp_d < dateBounds.minDate){
                dateBounds.minDate = tmp_d;
            }
            if(tmp_d > dateBounds.maxDate){
                dateBounds.maxDate = tmp_d;
            }
        });

        return dateBounds;
    }

    static browse(json,fn){
        json.forEach(data =>{
            let pos_tmp = [
                _map.getX(data.geometry.coordinates[0]),
                _map.getY(data.geometry.coordinates[1])
            ]

            if(Velib.exclude(pos_tmp))
                return;

            let tmp_d = _dataMngr.getRelTime(data.fields.duedate);
            fn(
                new DataVelib(data,
                    tmp_d,
                    Velib.avgLife,
                    pos_tmp[0],
                    pos_tmp[1],
                    3)
            );
        });
    }
}