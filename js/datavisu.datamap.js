class DataMap{
    allPoly = [];
    opacity = 100;
    img;

    internalGeoBounds = {
        minX : 99999999999999, 
        maxX : 0, 
        minY : 99999999999,
        maxY : 0
    }
    
    dimension = {
        width : 0, height : 0
    }
    pos = {
        x : 0, y : 0
    }

    constructor (_width , _height ,posx = 0,posy = 0){
        this.dimension.width = _width;
        this.dimension.height = _height;
        this.pos.x = posx;
        this.pos.y = posy;
    }

    setup = (json)=>{
        //prepare bounds
        json.forEach(zone =>{
            zone.fields.geo_shape.coordinates.forEach(_e => {
                _e.forEach(coords => {
                    if(coords[0] < this.internalGeoBounds.minX)
                        this.internalGeoBounds.minX = coords[0];
                    if(coords[0] > this.internalGeoBounds.maxX)
                        this.internalGeoBounds.maxX = coords[0];
            
                    if(coords[1] < this.internalGeoBounds.minY)
                        this.internalGeoBounds.minY = coords[1];
                    if(coords[1] > this.internalGeoBounds.maxY)
                        this.internalGeoBounds.maxY = coords[1];
                });
            });
        });

        //prepare polygon coordonates
        let allPolyCoords = [];
        json.forEach(zone =>{
            zone.fields.geo_shape.coordinates.forEach(_e =>{

                if(zone.fields.geo_shape.type == "MultiPolygon"){
                    _e.forEach(_coords => {
                        allPolyCoords = [];
                        _coords.forEach(coords =>{
                            allPolyCoords.push([this.getX(coords[0]),this.getY(coords[1])]);
                        })
                        this.allPoly.push(allPolyCoords);
                    });
                }else{
                    allPolyCoords = [];
                    _e.forEach(coords => {
                        allPolyCoords.push([this.getX(coords[0]),this.getY(coords[1])]);
                    });

                    this.allPoly.push(allPolyCoords);
                }
            })
        });

        //draw the map one time
        this.img = _p.createGraphics(_p.width,_p.height);

        this.img.stroke(20,10,255,this.opacity);
        this.img.strokeWeight(2);
        this.img.fill('#000000');

        this.allPoly.forEach(poly => {
            this.img.beginShape();
            poly.forEach(coords => {
                this.img.vertex(coords[0], coords[1]);
            });
            this.img.endShape(this.img.CLOSE);
        });
    }

    draw = (p)=>{
        p.image(this.img,0,0);

        document.getElementById("logs").innerHTML = _dataMngr.getCurrentProjectedDate().toLocaleString('fr-FR', { timeZone: 'UTC' })
        + "\r\n" +
        JSON.stringify(_dataMngr.datesBounds)+
        "\r\n"
        + Math.round(_p.millis());
    }
    
    getX = (x)=> {
        var position = (x - this.internalGeoBounds.minX) / (this.internalGeoBounds.maxX - this.internalGeoBounds.minX); 
        return this.pos.x + this.dimension.width*position;
    }
    getY = (y)=>{
        var position = (y - this.internalGeoBounds.minY) / (this.internalGeoBounds.maxY - this.internalGeoBounds.minY); 
        return this.pos.y + this.dimension.height- this.dimension.height*position;
    }
}