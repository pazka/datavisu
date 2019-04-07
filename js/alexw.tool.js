let maxFpa = 0;
let frame = 0;
function getFrame(framePerAction,fn){
    if(frameCount % framePerAction == 0)
        fn();
}

function rdm(){
    return Math.random();
}

function vs(speed = 500){
    return _p.sin((_p.millis()/speed)%360);
}
function vc(speed = 500){
    return _p.cos((_p.millis()/speed)%360);
}

var logs = "";
function _log(str){
    logs += str+";";
}

function drawTarget(p,xloc, yloc, size, num, color,opacity) {
    p.noStroke();
    const steps = size / num;
    for (let i = 0; i < num; i++) {
        p.fill( color[0]*i/num, color[1]*i/num, color[2]*i/num, opacity*(i/num) );
        p.ellipse(xloc, yloc, size - i * steps, size - i * steps );
    }
}

function isInsideCircles(coords,center,radiusMin, radiusMax){
   // console.log(coords,center,radiusMin, radiusMax)
   // console.log((_p.sq(coords[0] - center[0]) + _p.sq((coords[1] - center[1]) >= radiusMin * radiusMin )) &&
   // (_p.sq(coords[0] - center[0]) + _p.sq(coords[1] - center[1]) <= radiusMax * radiusMax ));
    
    return (_p.sq(coords[0] - center[0]) + _p.sq(coords[1] - center[1]) >= radiusMin * radiusMin ) &&
           (_p.sq(coords[0] - center[0]) + _p.sq(coords[1] - center[1]) <= radiusMax * radiusMax )
}