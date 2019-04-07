//https://opendata.paris.fr/explore/dataset/velib-disponibilite-en-temps-reel/information/
class DataVelib extends Data{
    size;

    constructor(date,life,x,y,_size = 10){
        super(date,life,x,y);
        this.size = _size;
    }

    draw(p){
        let x = (this.age/this.life);
        drawTarget(p,this.pos.x, this.pos.y, this.size, 10, [255,50,0], 100- 100*x*x); // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=100-\frac{x}{110-x}\cdot10
        super.draw(p);
    }
}

class Velib extends DataType{
    type = "Velib";
    
    static getBounds(json,dateBounds){
        json.forEach(data =>{
            if(Velib.exclude())
                return;

            let tmp_d =  (new Date(data.fields.duedate)).getTime() ;


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
            if(Velib.exclude())
                return;

            let tmp_d = _dataMngr.getRelTime((new Date(data.fields.duedate)).getTime());
            fn(
                new DataVelib(tmp_d,
                    6000,
                    _map.getX(data.geometry.coordinates[0]),
                    _map.getY(data.geometry.coordinates[1]),
                    20+rdm()*10)
            );
        });
    }

    static exclude(){
        return false;
    }
}