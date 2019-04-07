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
        //p.tint(255, 100-(x/(110-x))*10)
        p.image(_allRencPolyRendered[this.index],0,0); // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=100-\frac{x}{110-x}\cdot10
        drawTarget(p,this.pos[0], this.pos[1], vs()*50, 10, [vc()*100,200+vc()*55,200+vs()*55], 100 - 100*x*x); // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=100-\frac{x}{110-x}\cdot10
       // p.noTint();
    }
}

let _allRencPolyRendered = [];
let _indexToCall;

class Renc extends DataType{
    type = "Renc";

    static browse(json,fn){
        _indexToCall = 0;
        json.forEach(data =>{
            let graphics = _p.createGraphics(_map.dimension.width,_map.dimension.height);
            if(_allRencPolyRendered.length == 0){//draw data
                graphics.stroke(50,255,255);
                graphics.strokeWeight(2);
                graphics.fill(20,170,170);
    
    
                if(data.geometry.type == "MultiPolygon"){
                    data.geometry.coordinates[0][0].forEach((poly)=>{
                        let img = _p.createImage(_map.dimension.width,_map.dimension.height);
    
                        graphics.beginShape();
                        poly.forEach(coords=>{
                            graphics.vertex(_map.getX(coords[0]), _map.getY(coords[1]));
                        })
                        graphics.endShape(graphics.CLOSE);
    
                        graphics.copy(img,0,0,graphics.width,graphics.height,0,0,img.width,img.height);
                        _allRencPolyRendered.push(img);
                    })
                }else{
                    let img = _p.createImage(_map.dimension.width,_map.dimension.height);
                    graphics.beginShape();
                    data.geometry.coordinates[0][0].forEach((coords)=>{
                        graphics.vertex(_map.getX(coords[0]), _map.getY(coords[1]));
                    })
                    graphics.endShape(graphics.CLOSE);
    
                    graphics.copy(img,0,0,graphics.width,graphics.height,0,0,img.width,img.height);
                    _allRencPolyRendered.push(img);
                }
            }
            
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
