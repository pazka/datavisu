//https://opendata.paris.fr/explore/dataset/que-faire-a-paris-/table/?disjunctive.category&disjunctive.tags&disjunctive.address_zipcode&disjunctive.address_city&disjunctive.access_type&disjunctive.price_type
class DataRenc extends Data{
    index
    pos

    constructor(date,life,_index,pos){
        super(date,life,_map.pos.x,_map.pos.y);
        this.index = _index;
        this.pos = pos;
    }

    draw(p){        
        let x = (this.age/this.life);
       drawTarget(p,this.pos[0], this.pos[1], vs()*50, 10, [vc()*100,200+vc()*55,200+vs()*55], 100 - 100*x*x); // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=100-\frac{x}{110-x}\cdot10
      
    }
}

let _allRencPolyRendered = [];
let _indexToCall;

class Renc extends DataType{
    type = "Renc";

    static browse(json,fn){
        _indexToCall = 0;
        json.forEach(data =>{
            //orchestrate data
            fn(
                new DataRenc((_dataMngr.datesBounds.totalTimeLength / _allRencPolyRendered.length)*_indexToCall,
                    (_dataMngr.datesBounds.totalTimeLength / _allRencPolyRendered.length),
                    _indexToCall,
                    [_map.getX(data.properties.geo_point_2d[1]),_map.getY(data.properties.geo_point_2d[0])])
            );
            _indexToCall++;
        });
    }
    
    static exclude(data){
    }
}
