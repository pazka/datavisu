let _map;
let _p;
let _dataMngr;
let _frameRate = 30;
let _canvas;
let _isCapturing = false;
let _stop = false;
_shaderMngr;
//économie, environnement, vie cit , urbanisme


let _bounds = [];
let index = 0;


let s = function (p) {
    _p = p;
    p.preload =()=>{
        _shaderMngr =  new ShaderManager()
        _shaderMngr.loadShaders(p);
    }

    p.setup = () => {
        _canvas = p.createCanvas(1920,1080);
        _canvas.parent("#p5-container");
        p.noStroke();
        p.frameRate(_frameRate);
        p.background('#000000');
        p.fill('#000000');

        //preventing Date shit
        import_velib_json.forEach(data =>{
            data.fields.duedate =  (new Date(data.fields.duedate)).getTime() ;
        });

        import_event_json.forEach(data =>{
            data.properties.date_start = (new Date(data.properties.date_start)).getTime();
            data.properties.date_end = (new Date(data.properties.date_end)).getTime();
        });

        _map = new DataMap(p.width * 0.9, p.height * 0.9, p.width * 0.10, p.height * 0.10);
        _map.setup(import_pdz_json);
        _map.prepareMask(_p);
        _dataMngr = new DataManager();
        _dataMngr.updateBounds(Velib.getBounds(import_velib_json, { maxDate: 0, minDate: Infinity }))
        _dataMngr.updateBounds(Event.getBounds(import_event_json, _dataMngr.datesBounds))
        _map.setupGrid(import_carroyage_json);
        _dataMngr.newPhase()

        let elem = document.querySelector('#loading');
        elem.parentNode.removeChild(elem);

        if (_isCapturing)
            _capturer.start();
    }

    p.draw = () => {
        if(_stop)
            return
            
        _map.draw(_p);

        _dataMngr.drawData();
        _flock.run();

        _map.drawMask(_p);

        if (_isCapturing)
            _capturer.capture(_canvas.canvas);
    }

    /* p.mouseClicked = (m)=>{
         if(!m.ctrlKey)        
         _bounds.push({
             i : index++,
             x : p.mouseX/p.width,
             y : p.mouseY/p.height
         })
         
     }*/


    p.keyPressed = function () {
        if (p.key == "s") {
            _capturer.save()
        }else if (p.key == "c"){
            _map.toggleGrid()
        }else if (p.key == "l"){
            _map.toggleLog()
        }else if (p.key == "m"){
            _map.toggleMap()
        }
    }
};


let myp5 = new p5(s);
