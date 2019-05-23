//https://opendata.paris.fr/explore/dataset/que-faire-a-paris-/table/?disjunctive.category&disjunctive.tags&disjunctive.address_zipcode&disjunctive.address_city&disjunctive.access_type&disjunctive.price_type
class DataEvent extends Data{
    size;

    constructor(date,life,x,y,_size = 10){
        super(date,life,x,y);
        this.size = _size;
    }

    draw(p){        
        let x = (this.age/this.life);
        drawTarget(p,this.pos.x, this.pos.y, this.size, 10, [255,205,50], 255*(1-Math.abs((0.5-x)*2))); // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=100-\frac{x}{110-x}\cdot10
        super.draw(p);
    }
}

class Event extends DataType{
    type = "Event";

    static getBounds(json,dateBounds){
        json.forEach(data =>{
            if(Event.exclude(data))
                return;

            let tmp_d_s = (new Date(data.properties.date_start)).getTime();
            let tmp_d_e = (new Date(data.properties.date_end)).getTime();
    
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

            let tmp_d_s = _dataMngr.getRelTime((new Date(data.properties.date_start)).getTime());
            let tmp_d_e = _dataMngr.getRelTime((new Date(data.properties.date_end)).getTime());
            
            fn(
                new DataEvent(tmp_d_s,
                    tmp_d_e - tmp_d_s,
                    pos_tmp[0],
                    pos_tmp[1],
                    3)
            );
        });
    }
    
    static exclude(data){
        //return ( data.geometry == null || (new Date(data.properties.date_start)).getTime() <= 1415019600000 ) //< 2017
        return   data.geometry == null 
        || (new Date(data.properties.date_start)).getTime() <= 1512000000000 
        || !isInsidePoly([_map.getX(data.geometry.coordinates[0]),_map.getY(data.geometry.coordinates[1])],_map.screenBounds.points )   //< 2018
    }
}
