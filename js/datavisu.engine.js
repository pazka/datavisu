let _map;
let _p;
let _dataMngr;
let _frameRate = 30;
let _canvas;
let _isCapturing = false;
let _stop = false;
let _shaderMngr;
//économie, environnement, vie cit , urbanisme

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

        
        _map = new DataMap(p.width , p.height ,0, 0);
        _map.setup()
        _map.prepareMask(_p)
        //New type to register here
        _dataMngr = new DataManager([Air,Sirene,Ril])
        _dataMngr.updateDateBounds()
        _map.setupGrid();
        _dataMngr.newPhase()

        let elem = document.querySelector('#loading');
        elem.parentNode.removeChild(elem);

        if (_isCapturing)
            _capturer.start();
    }

    p.draw = () => {
        if(_stop)
            return

        // if(_dataMngr.getTimeRef() == 500){
        //     _stop = true;
        // }

        //only in webgl
        //p.scale(_map.zoom)
        //p.translate(-p.width*((_map.zoom - 1)/2),-p.height*((_map.zoom-1)/2));
        _map.draw(_p);
        
        _dataMngr.drawData();

        _map.drawMask(_p);

        if (_isCapturing)
            _capturer.capture(_canvas.canvas);
    }


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
