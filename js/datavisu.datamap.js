class DataMap {
    allPoly = [];
    opacity = 20;
    mapStrokeImg;
    mapMaskImg;

    gridOn = false
    mapPopGrid;


    screenBounds = {
        lines: [[[0.4427083333333333, 0.15789473684210525], [0.6595052083333334, 0.16204986149584488]],
        [[0.6595052083333334, 0.16204986149584488], [0.7135416666666666, 0.3767313019390582]],
        [[0.7135416666666666, 0.3767313019390582], [0.7239583333333334, 0.685595567867036]],
        [[0.7239583333333334, 0.685595567867036], [0.5325520833333334, 0.8795013850415513]],
        [[0.5325520833333334, 0.8795013850415513], [0.23828125, 0.6842105263157895]],
        [[0.23828125, 0.6842105263157895], [0.3307291666666667, 0.29362880886426596]],
        [[0.3307291666666667, 0.29362880886426596], [0.4427083333333333, 0.15789473684210525]]
        ],
        points: [[0.4427083333333333, 0.15789473684210525], [0.6595052083333334, 0.16204986149584488],
        [0.7135416666666666, 0.3767313019390582], [0.7239583333333334, 0.685595567867036],
        [0.5325520833333334, 0.8795013850415513], [0.23828125, 0.6842105263157895],
        [0.3307291666666667, 0.29362880886426596], [0.4427083333333333, 0.15789473684210525]
        ],
        maxX: 0,
        maxY: 0,
        minX: 100,
        minY: 100,
    }

    internalGeoBounds = {
        minX: Infinity,
        maxX: 0,
        minY: Infinity,
        maxY: 0
    }

    popBounds = {
        min : Infinity,
        max : 0
    }
    gridColors = [
        [255,255,255],
        [255,170,170],
        [255,85,85],
        [255,0,0],
    ]

    dimension = {
        width: 0, height: 0
    }
    pos = {
        x: 0, y: 0
    }

    constructor(_width, _height, posx = 0, posy = 0) {
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

    setup = (json) => {
        //prepare bounds
        json.forEach(zone => {
            zone.fields.geo_shape.coordinates.forEach(_e => {
                _e.forEach(coords => {
                    if (coords[0] < this.internalGeoBounds.minX)
                        this.internalGeoBounds.minX = coords[0];
                    if (coords[0] > this.internalGeoBounds.maxX)
                        this.internalGeoBounds.maxX = coords[0];

                    if (coords[1] < this.internalGeoBounds.minY)
                        this.internalGeoBounds.minY = coords[1];
                    if (coords[1] > this.internalGeoBounds.maxY)
                        this.internalGeoBounds.maxY = coords[1];
                });
            });
        });

        //prepare polygon coordonates
        let allPolyCoords = [];
        json.forEach(zone => {
            zone.fields.geo_shape.coordinates.forEach(_e => {

                if (zone.fields.geo_shape.type == "MultiPolygon") {
                    _e.forEach(_coords => {
                        allPolyCoords = [];
                        _coords.forEach(coords => {
                            allPolyCoords.push([this.getX(coords[0]), this.getY(coords[1])]);
                        })
                        this.allPoly.push(allPolyCoords);
                    });
                } else {
                    allPolyCoords = [];
                    _e.forEach(coords => {
                        allPolyCoords.push([this.getX(coords[0]), this.getY(coords[1])]);
                    });

                    this.allPoly.push(allPolyCoords);
                }
            })
        });

        //draw the map one time
        this.mapStrokeImg = _p.createGraphics(_p.width, _p.height);

        this.mapStrokeImg.stroke([20, 10, 255, this.opacity]);
        this.mapStrokeImg.strokeWeight(1);
        this.mapStrokeImg.fill([0, 0, 0, this.opacity]);

        this.allPoly.forEach(poly => {
            this.mapStrokeImg.beginShape();
            poly.forEach(coords => {
                this.mapStrokeImg.vertex(coords[0], coords[1]);
            });
            this.mapStrokeImg.endShape(this.mapStrokeImg.CLOSE);
        });

    }

    setupGrid(json){
        let includedSquares = []
        //draw Squares
        this.mapPopGrid = _p.createGraphics(_p.width, _p.height);
        this.mapPopGrid.noStroke()

        json.forEach((square)=>{
            //check every point if out of bounds
            let toExclude = true
            square.geometry.coordinates[0].forEach((point)=>{
                let test = [this.getX(point[0]),this.getY(point[1])]
                if(!DataType.exclude(test)){
                    toExclude = false
                }
            })
            //if totally out of bounds stop this iteration
            if(toExclude  ){
                return;
            }

            includedSquares.push(square)

            if(_map.popBounds.min > square.properties.pop)
                _map.popBounds.min = square.properties.pop
            if(_map.popBounds.max < square.properties.pop)
                _map.popBounds.max = square.properties.pop
        })

        //popBounds have been made, calculate step
        let shift = 0.7;
        let step = ((_map.popBounds.max -  _map.popBounds.min) / (this.gridColors.length +1) ) * shift

        includedSquares.forEach((square)=>{
            //draw vertex in grid with adequat color
            let colorIndex = Math.floor((square.properties.pop - _map.popBounds.min)/step);
            colorIndex  = colorIndex > 3 ? 3 :  colorIndex;
            this.mapPopGrid.fill(_map.gridColors[colorIndex])

            //draw Vertex
            this.mapPopGrid.beginShape();
            square.geometry.coordinates[0].forEach((point)=>{
                this.mapPopGrid.vertex(this.getX(point[0]),this.getY(point[1]))
            })
            this.mapPopGrid.endShape(this.mapPopGrid.CLOSE);
        })
    }

    draw = (p, opa = false) => {
        //draw map
        p.image(this.mapStrokeImg, 0, 0);

        //
        
        document.getElementById("logs").innerHTML = "S : Save / C : Carroyage "
        + "\r\n" +
        _dataMngr.getCurrentProjectedDate().toLocaleString('fr-FR', { timeZone: 'UTC' })
            + "\r\n" +
            JSON.stringify(_dataMngr.datesBounds) +
            "\r\n" +
            Math.round(_dataMngr.getTimeRef()) +
            "\r\n" +
            "Progress : " + Math.round((_dataMngr.getTimeRef()) / (_dataMngr.datesBounds.totalTimeLength) * 100, 2) + "%" +
            "\r\n" +
            JSON.stringify(_bounds) +
            "\r\n" +
            "vs:" + Math.round(vs()) +
            "\r\n" +
            "vc:" + Math.round(vc())+
            "\r\n" +
            "flock objective:" + _flock.objective[0] + "/" +_flock.objective[1]
            ;
    }

    prepareMask = (p) => {
        this.mapMaskImg = p.loadImage('./res/mask1.png')

        /*
        //create balck mapMaskImg
        this.mapMaskImg = p.createGraphics(p.width,p.height);
        this.mapMaskImg.fill("#000000");
      //  this.mapMaskImg.stroke("#FF0000")
        this.mapMaskImg.beginShape();
        for (let i = 0; i < this.screenBounds.points.length; i++) {
            this.mapMaskImg.vertex(this.screenBounds.points[i][0],this.screenBounds.points[i][1]) 
        }
        this.mapMaskImg.vertex(this.screenBounds.points[0][0],this.screenBounds.points[0][1])
        this.mapMaskImg.vertex(0,0)
        this.mapMaskImg.vertex(0,this.mapMaskImg.height)
        this.mapMaskImg.vertex(this.mapMaskImg.width,this.mapMaskImg.height)
        this.mapMaskImg.vertex(this.mapMaskImg.width,0)
        this.mapMaskImg.vertex(0,0)
        this.mapMaskImg.endShape(this.mapMaskImg.CLOSE);*/
    }

    toggleGrid(){
        this.gridOn = !this.gridOn
    }
    drawMask(p){
        //draw bounds mapMaskImg
        p.image(this.mapMaskImg, 0, 0, p.width, p.height)

        if(this.gridOn)
            p.image(this.mapPopGrid, 0, 0, p.width, p.height)

    }

    getX = (x) => {
        //get ratio
        let position = (x - this.internalGeoBounds.minX) / (this.internalGeoBounds.maxX - this.internalGeoBounds.minX);
        //get screen pos
        return this.pos.x + this.dimension.width * position;
    }

    getY = (y) => {
        //get ratio
        let position = (y - this.internalGeoBounds.minY) / (this.internalGeoBounds.maxY - this.internalGeoBounds.minY);
        //get screen pos
        return this.pos.y + this.dimension.height - this.dimension.height * position;
    }
}