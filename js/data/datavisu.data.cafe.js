//https://opendata.paris.fr/explore/dataset/que-faire-a-paris-/table/?disjunctive.category&disjunctive.tags&disjunctive.address_zipcode&disjunctive.address_city&disjunctive.access_type&disjunctive.price_type
class DataCafe extends Data{
    pos
    type = "Cafe"

    constructor(rawData,date,life,pos){
        super(rawData,date,life,_map.pos.x,_map.pos.y);
        this.pos = pos;
    }

    draw(p){        
        let x = (this.age/this.life);
        //p.tint(255, 100-(x/(110-x))*10)
        //p.image(_allCafePolyRendered[this.index],0,0); // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=100-\frac{x}{110-x}\cdot10
        // p.push();
        // p.translate( 0.2, 0.5);
        // drawStar(p,this.pos[0], this.pos[1], 30,vc(this.noise*this.noise*100)*30*easeInOut(x),this.noise, [vs(200)*200+55,vs(250)*100+155,vs(200)*55, 255*(1-Math.abs((0.5-x)*2))]); // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=100-\frac{x}{110-x}\cdot10
        // p.pop()
        // p.noTint();
        super.draw(p);
    }
}

let _allCafePolyRendered = [];
let _allCafeLength = 0;

class Cafe extends DataType{
    type = "Cafe";

    static browse(json,fn){
        let indexToCall = 0;
        let _allCafeLength = 0;

        json.forEach(data =>{
            if(!Cafe.exclude(data))
                _allCafeLength++;
        })

        json.forEach(data =>{
            
            //orchestrate data
            if(!Cafe.exclude(data)){
                fn(
                    new DataCafe(
                        data,
                        (_dataMngr.datesBounds.totalTimeLength / _allCafeLength)*indexToCall,
                        (_dataMngr.datesBounds.totalTimeLength / _allCafeLength),
                        [_map.getX(data.geometry.coordinates[0]),_map.getY(data.geometry.coordinates[1])])
                );
                indexToCall++
            }
        });
    }
    
    static exclude(data){
        return data.geometry == null || data.properties.date_end >= 1570393800000
    }
}
