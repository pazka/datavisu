//https://opendata.paris.fr/explore/dataset/que-faire-a-paris-/table/?disjunctive.category&disjunctive.tags&disjunctive.address_zipcode&disjunctive.address_city&disjunctive.access_type&disjunctive.price_type
class DataEvent extends Data{
    size;
    type = "Event"

    constructor(rawData,date,life,x,y,_size = 10){
        super(rawData,date,life,x,y);
        this.size = _size;
    }

    draw(p){        
        let x = (this.age/this.life);
        // drawTarget(p,this.pos.x, this.pos.y, this.size, 10, [255,205,50], 255*(1-Math.abs((0.5-x)*2))); // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=100-\frac{x}{110-x}\cdot10
        // super.draw(p);
       // drawStar(p,this.pos.x, this.pos.y, 1,vs(this.noise*100)*100*easeInOut(x),this.noise, [vs(100)*127+vc(100)*127,vs(200)*127+vc(300)*127,vs(300)*127+vc(600)*127, 255*easeInOut(x)]); // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=100-\frac{x}{110-x}\cdot10

        super.draw(p);
    }
}

class Event extends DataType{
    type = "Event";

    static getBounds(json,dateBounds){
        json.forEach(data =>{
            if(Event.exclude(data))
                return;

            let tmp_d_s = data.properties.date_start
            let tmp_d_e = data.properties.date_end
    
            if(tmp_d_s < dateBounds.minDate){
                dateBounds.minDate = tmp_d_s;
            }
            if(tmp_d_e > dateBounds.maxDate){
                dateBounds.maxDate = tmp_d_e;
            }
        });
        
        return dateBounds;
    }
    
    static browse(json,fn){
        json.forEach(data =>{

            if(Event.exclude(data))
                return;

            let pos_tmp = [
                _map.getX(data.geometry.coordinates[0]),
                _map.getY(data.geometry.coordinates[1])
            ]

            let tmp_d_s = _dataMngr.getRelTime(data.properties.date_start);
            let tmp_d_e = _dataMngr.getRelTime(data.properties.date_end);
            
            fn(
                new DataEvent(
                    data,
                    tmp_d_s,
                    tmp_d_e - tmp_d_s,
                    pos_tmp[0],
                    pos_tmp[1],
                    3)
            );
        });
    }
    
    static exclude(data){
        //return ( data.geometry == null || data.properties.date_start <= 1415019600000 ) //< 2017
        return   data.geometry == null 
        || data.properties.date_end >= 1570393800000
        || data.properties.date_start <= 1512000000000 
        || !isInsidePoly([_map.getX(data.geometry.coordinates[0]),_map.getY(data.geometry.coordinates[1])],_map.screenBounds.points )   //< 2018
    }
}
