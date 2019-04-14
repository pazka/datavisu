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
function drawTargetBis(p,xloc, yloc, size, num,colors,opacity) {
    p.noStroke();
    const steps = size / num;
    for (let i = 0; i < num; i++) {
        p.fill(colors[i][0],colors[i][1],colors[i][2],opacity );
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


function isInsidePoly(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

function drawGradientTriangle(p,base,vertex,colorBase,colorVertex,steps){
    //Base to Vertex
    let vectColor = [
        ((colorVertex[0]-colorBase[0])/steps),
        ((colorVertex[1]-colorBase[1])/steps),
        ((colorVertex[2]-colorBase[2])/steps),
        ((colorVertex[3]-colorBase[3])/steps)
    ];
    let vectFirstSegment =[
        (vertex[0]-base[0][0])/steps,(vertex[1]-base[0][1])/steps
    ]
    let vectSecondSegment =[
        (vertex[0]-base[1][0])/steps,(vertex[1]-base[1][1])/steps
    ]

    for (let step = 0; step < steps; step++) {
        p.fill([
            colorBase[0] + vectColor[0]*step,
            colorBase[1] + vectColor[1]*step,
            colorBase[2] + vectColor[2]*step,
            colorBase[3] + vectColor[3]*step
        ]);

        p.beginShape();
        //drawBase
        p.vertex(base[0][0] + vectFirstSegment[0]   *step,base[0][1] + vectFirstSegment[1] *step);
        p.vertex(base[1][0] + vectSecondSegment[0]  *step,base[1][1] + vectSecondSegment[1]   *step);

        //draw to temp segment ( tales)
        p.vertex(base[1][0] + vectSecondSegment[0]*(step+1) ,base[1][1] + vectSecondSegment[1]  *(step+1));
        p.vertex(base[0][0] + vectFirstSegment[0]*(step+1)  ,base[0][1] + vectFirstSegment[1]   *(step+1));

        p.endShape(p.CLOSE);
    }
}

function opacityFn(x){
    // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=103-\frac{100}{x+1}-\frac{x}{101-x}
    return (100-(255/x+1)-(x/(255-x)))
}