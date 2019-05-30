

//https://opendata.paris.fr/explore/dataset/velib-disponibilite-en-temps-reel/information/
class DataSound extends Data{
    constructor(date,val){
        super(date,1000,_p.width/2,_p.height/2);
    }

    draw(p){
        let x = (this.age/this.life);
        super.draw(p);
    }
}

class Sound extends DataType{
    type = "Sound";

    static getBounds(json,dateBounds){
        json.forEach(data =>{
            if(Sound.exclude(data))
                return;

            let tmp_d = (new Date(data.timestamp)).getTime() ;


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

            if(Sound.exclude(pos_tmp))
                return;

            let tmp_d = _dataMngr.getRelTime((new Date(data.timestamp)).getTime());
            fn(
                new DataSound(tmp_d,data.value)
            );
        });
    }
}