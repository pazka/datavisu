//https://opendata.paris.fr/explore/dataset/que-faire-a-paris-/table/?disjunctive.category&disjunctive.tags&disjunctive.address_zipcode&disjunctive.address_city&disjunctive.access_type&disjunctive.price_type

function opacityFn(x){
    // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=103-\frac{100}{x+1}-\frac{x}{101-x}
    return (255-(255/x+1)-(x/(255-x)))
}

class DataRenc extends Data{
    index
    pos

    constructor(date,life,pos){
        super(date,life,_map.pos.x,_map.pos.y);
        this.pos = pos;
    }

    draw(p){        
        let x = (this.age/this.life)*255;
        //p.tint(255, 100-(x/(110-x))*10)
      /*  _map.screenBounds.lines.forEach((line)=>{
            drawGradientTriangle(p,line,[this.pos[0],this.pos[1]],[255,0,0,50],[0,0,255,100],100);
        })*/

        drawTarget(p,this.pos[0], this.pos[1], vs()*50, 10, [vc()*100,200+vc()*55,255], opacityFn(x));  //p.text((this.age/this.life)*100,this.pos[0], this.pos[1])
       // p.noTint();
    }
}

let _allRencPolyRendered = [];
let _allRencLength = 0;

class Renc extends DataType{
    type = "Renc";

    static browse(json,fn){
        let indexToCall = 0;
        _allRencLength = 0;

        json.forEach(() =>{
            _allRencLength++;
        })
        
        json.forEach(data =>{
            //orchestrate data
            fn(
                new DataRenc((_dataMngr.datesBounds.totalTimeLength / _allRencLength)*indexToCall,
                    (_dataMngr.datesBounds.totalTimeLength / _allRencLength),
                    [_map.getX(data.properties.geo_point_2d[1]),_map.getY(data.properties.geo_point_2d[0])])
            );
            indexToCall++;
        });
    }
    
    static exclude(data){
    }
}
