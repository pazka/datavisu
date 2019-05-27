let _map;
let _p;
let _dataMngr;
let _frameRate = 30;
let _canvas;
let _isCapturing = false;
//économie, envirronement, vie cit , urbanisme

function loadDates() {
    let loadProg = document.getElementById('loading-progress');
    //set data timing

    Velib.browse(import_velib_json, (velib) => {
        _dataMngr.addData(velib);
    })

    Event.browse(import_event_json, (event) => {
        _dataMngr.addData(event);
    })


    Elec.browse(import_elec_json, (elec) => {
        _dataMngr.addData(elec);
    })


    Renc.browse(import_renc_json, (renc) => {
        _dataMngr.addData(renc);
    })


    Cafe.browse(import_cafe_json, (cafe) => {
        _dataMngr.addData(cafe);
    })
    
    Traveler.browse(import_traveler_json, (travel) => {
        _dataMngr.addData(travel);
    })

    //loop
    _dataMngr.timeStart();
    /*
        setTimeout(()=>{
            loadDates();
        },_dataMngr.datesBounds.totalTimeLength);*/
}
let _bounds = [];
let index = 0;
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
        loadDates();

        // Add an initial set of boids into the system
        for (let i = 0; i < 400; i++) {
            let b = new Boid(_p.width / 2, _p.height / 2);
            _flock.addBoid(b);
        }

        let elem = document.querySelector('#loading');
        elem.parentNode.removeChild(elem);
        for (let i = 0; i < 10; i++) {
            _map.draw(_p);
        }

        if (_isCapturing)
            _capturer.start();

    }

    p.draw = () => {
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
        }
    }
};

let myp5 = new p5(s);
