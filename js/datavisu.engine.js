let _map;
let _p;
let _dataMngr;

//économie, envirronement, vie cit , urbanisme

function loadDates(){
    let loadProg = document.getElementById('loading-progress');
    //set data timing
    Velib.browse(import_velib_json,(velib)=>{
        setTimeout(()=>{
            _dataMngr.addData(velib);
        },velib.date);
    })

    Event.browse(import_event_json,(event)=>{
        setTimeout(()=>{
            _dataMngr.addData(event);
        },event.date);
    })

    
    Elec.browse(import_elec_json,(elec)=>{
        setTimeout(()=>{
            _dataMngr.addData(elec);
        },elec.date);
    })

    
    Renc.browse(import_renc_json,(renc)=>{
        setTimeout(()=>{
            _dataMngr.addData(renc);
        },renc.date);
    })

    
    Cafe.browse(import_cafe_json,(cafe)=>{
        setTimeout(()=>{
            _dataMngr.addData(cafe);
        },cafe.date);
    })

    //loop
    _dataMngr.timeStart();

    setTimeout(()=>{
        loadDates();
    },_dataMngr.datesBounds.totalTimeLength);
}
let _bounds = [];
let index = 0;
let s = function( p ) {
    _p = p;
    p.setup = ()=> {
        let cnv = p.createCanvas(window.innerWidth, window.innerHeight);
        cnv.parent("#p5-container");
        p.noStroke();
      //  p.frameRate(30);
        p.background('#000000');
        p.fill('#000000');

        _map = new DataMap(p.width*0.7,p.height*0.7,p.width*0.17,p.height*0.15);
        _map.setup(import_pdz_json);
        _map.prepareMask(_p);
        _dataMngr = new DataManager();
        _dataMngr.updateBounds(Velib.getBounds(import_velib_json, { maxDate : 0, minDate : 999999999999999 }))
        _dataMngr.updateBounds(Event.getBounds(import_event_json, _dataMngr.datesBounds))
        
        loadDates();

        let elem = document.querySelector('#loading');
        elem.parentNode.removeChild(elem);
    }
    
    p.draw = ()=>{
        _p.fill('#000000')
        _p.rect(0,0,_p.width,_p.height);
        _map.draw(_p);
        _dataMngr.drawData();
        _map.drawMask(_p);
    }

   /* p.mouseClicked = (m)=>{
        if(!m.ctrlKey)        
        _bounds.push({
            i : index++,
            x : p.mouseX/p.width,
            y : p.mouseY/p.height
        })
        
    }*/
};

let myp5 = new p5(s);