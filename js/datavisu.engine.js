let _map;
let _p;
let _dataMngr;
let _frameRate = 30;
let _canvas;
let _isCapturing = false;
let _stop = false;
//économie, envirronement, vie cit , urbanisme


let _bounds = [];
let index = 0;
var myBoids = []

let s = function (p) {
    _p = p;
    p.setup = () => {
        _canvas = p.createCanvas(window.innerWidth, window.innerHeight);
        _canvas.parent("#p5-container");
        p.noStroke();
        p.frameRate(_frameRate);
        p.background('#000000');
        p.fill('#000000');

        _map = new DataMap(p.width * 0.7, p.height * 0.7, p.width * 0.17, p.height * 0.15);
        _map.setup(import_pdz_json);
        _map.prepareMask(_p);
        _dataMngr = new DataManager();
        _dataMngr.updateBounds(Velib.getBounds(import_velib_json, { maxDate: 0, minDate: Infinity }))
        _dataMngr.updateBounds(Event.getBounds(import_event_json, _dataMngr.datesBounds))
        _map.setupGrid(import_carroyage_json);
        _dataMngr.loadDates();

        let elem = document.querySelector('#loading');
        elem.parentNode.removeChild(elem);
        for (let i = 0; i < 10; i++) {
            _map.draw(_p);
        }

        // Add an initial set of boids into the system
        for (let i = 0; i < 300; i++) {
            let b = new Boid(_p.width / 2, _p.height / 2);
            myBoids.push(b);
        }

        _dataMngr.newPhase()

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
