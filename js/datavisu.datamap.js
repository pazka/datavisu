class DataMap{
    allPoly = [];
    opacity = 100;
    img;
    mask

    screenBounds ={
        lines : [ [[0.4427083333333333,0.15789473684210525],[0.6595052083333334,0.16204986149584488] ],
                [[0.6595052083333334,0.16204986149584488],[0.7135416666666666,0.3767313019390582]    ],
                [[0.7135416666666666,0.3767313019390582],[0.7239583333333334,0.685595567867036]      ],
                [[0.7239583333333334,0.685595567867036],[0.5325520833333334,0.8795013850415513]      ],
                [[0.5325520833333334,0.8795013850415513],[0.23828125,0.6842105263157895]             ],
                [[0.23828125,0.6842105263157895],[0.3307291666666667,0.29362880886426596]            ],
                [[0.3307291666666667,0.29362880886426596],[0.4427083333333333,0.15789473684210525]   ]
                ],
        points:[[0.4427083333333333,0.15789473684210525], [0.6595052083333334,0.16204986149584488],
                [0.7135416666666666,0.3767313019390582], [0.7239583333333334,0.685595567867036],
                [0.5325520833333334,0.8795013850415513], [0.23828125,0.6842105263157895],
                [0.3307291666666667,0.29362880886426596], [0.4427083333333333,0.15789473684210525]
                ],
        maxX : 0,
        maxY : 0,
        minX : 100,
        minY : 100,
    } 
    
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

        //init map screen bounds vertices
        for (let i = 0; i < this.screenBounds.lines.length; i++) {
            this.screenBounds.lines[i][0][0] *= _p.width;
            this.screenBounds.lines[i][1][0] *= _p.width;
            this.screenBounds.lines[i][0][1] *= _p.height;
            this.screenBounds.lines[i][1][1] *= _p.height;
        }

        //inir map screen bounds points
        for (let i = 0; i < this.screenBounds.points.length; i++) {
            this.screenBounds.points[i][0] *= _p.width;
            this.screenBounds.points[i][1] *= _p.height;
        }
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
        + Math.round(_p.millis())+
        "\r\n"+
        JSON.stringify(_bounds)+
        "\r\n"+
        "vs:"+Math.round(vs())+
        "\r\n"+
        "vc:"+Math.round(vc())
        ;
    }

    prepareMask = (p)=>{
        this.mask = p.createGraphics(p.width,p.height);
        this.mask.fill("#000000");
        this.mask.beginShape();
        for (let i = 0; i < this.screenBounds.points.length; i++) {
            this.mask.vertex(this.screenBounds.points[i][0],this.screenBounds.points[i][1])
        }
        this.mask.vertex(this.screenBounds.points[0][0],this.screenBounds.points[0][1])
        this.mask.vertex(0,0)
        this.mask.vertex(0,this.mask.width)
        this.mask.vertex(this.mask.width,this.mask.height)
        this.mask.vertex(0,this.mask.height)
        this.mask.vertex(0,0)
        this.mask.endShape(this.mask.CLOSE);
    }

    drawMask = (p)=>{
        p.image(this.mask,0,0)
    }

    getX = (x)=> {
        //get ratio
        let position = (x - this.internalGeoBounds.minX) / (this.internalGeoBounds.maxX - this.internalGeoBounds.minX); 
        //get screen pos
        return this.pos.x + this.dimension.width*position;
    }

    getY = (y)=>{
        //get ratio
        let position = (y - this.internalGeoBounds.minY) / (this.internalGeoBounds.maxY - this.internalGeoBounds.minY); 
        //get screen pos
        return this.pos.y + this.dimension.height - this.dimension.height*position;
    }
}