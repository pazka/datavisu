let _map;
let _p;
let _dataMngr;
let _frameRate = 30;
let _canvas;
let _isCapturing = false;
let _stop = false;
let _shaderMngr;
//économie, environnement, vie cit , urbanisme

let _bounds = [];
let index = 0;



_p = new p5((p) => {
    p.preload =()=>{
        _shaderMngr =  new ShaderManager(p,window.outerWidth,window.outerHeight)
        _shaderMngr.loadShaders()
    }

    p.setup = () => {
        _canvas = p.createCanvas(window.outerWidth,window.outerHeight)
        _canvas.parent("#p5-container")
        p.noStroke()
        p.frameRate(_frameRate)
        p.background('#000000')
        p.fill('#000000')

        //preventing Date shit
        import_velib_json.forEach(data =>{
            data.fields.duedate =  (new Date(data.fields.duedate)).getTime() 
        });

        import_event_json.forEach(data =>{
            data.properties.date_start = (new Date(data.properties.date_start)).getTime()
            data.properties.date_end = (new Date(data.properties.date_end)).getTime()
        });

        _map = new DataMap(p.width , p.height ,0, 0);
        _map.setup(import_pdz_json)
        _map.prepareMask(_p)
        _dataMngr = new DataManager()
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

        if(_dataMngr.getTimeRef() == 500){
            _stop = true;
        }

        //only in webgl
        // p.translate(-p.width/2,-p.height/2,0);

        _map.draw(_p);

        _dataMngr.drawData();

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
        }else if (p.key == "p"){
            _stop = !_stop
        }
    }
});
