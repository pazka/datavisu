//https://opendata.paris.fr/explore/dataset/que-faire-a-paris-/table/?disjunctive.category&disjunctive.tags&disjunctive.address_zipcode&disjunctive.address_city&disjunctive.access_type&disjunctive.price_type

function opacityFn(x){
    // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=103-\frac{100}{x+1}-\frac{x}{101-x}
    return (255-(255/x+1)-(x/(255-x)))
}

class DataRenc extends Data{
    index
    pos

    constructor(rawData,date,life,pos){
        super(rawData,date,life,pos[0],pos[1]);
        this.pos = pos;
    }

    draw(p){        
        let x = (this.age/this.life);
        //p.tint(255, 100-(x/(110-x))*10)
      /*  _map.screenBounds.lines.forEach((line)=>{
            drawGradientTriangle(p,line,[this.pos[0],this.pos[1]],[ 0,0,0,0],[ vs()*255,vc()*255,vs()*128+vc()*127,150],10);
        })*/

         drawConcentricLines(p,this.pos,50*x,10,2,30,5,500,255*easeInOut(x))
       //drawTarget(p,this.pos[0], this.pos[1], vs()*50, 10, [vc()*100,200+vc()*55,255], opacityFn(x));  //p.text((this.age/this.life)*100,this.pos[0], this.pos[1])
       // p.noTint();
       //super.draw(p)
    }
}

let _allRencPolyRendered = [];
let _allRencLength = 0;

class Renc extends DataType{
    type = "Renc";

    static browse(json,fn){
        let indexToCall = 0;
        _allRencLength = 0;
        _filterNumber = 7;

        json.forEach(() =>{
            if(Renc.exclude())
                return;

            _allRencLength++;
        })
        
        json.forEach(data =>{
            if(Renc.exclude())
                return;
            //orchestrate data
            fn(
                new DataRenc(
                    data,
                    (_dataMngr.datesBounds.totalTimeLength / _allRencLength)*indexToCall,
                    (_dataMngr.datesBounds.totalTimeLength / _allRencLength)*3,
                    [_map.getX(data.properties.geo_point_2d[1]),_map.getY(data.properties.geo_point_2d[0])])
            );
            indexToCall++;
        });
    }
    
    static exclude(){
        _nb = (_nb+ 1) % _filterNumber
        return _nb != 0
    }
}
