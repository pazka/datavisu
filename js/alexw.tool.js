let maxFpa = 0;
let frame = 0;
function getFrame(framePerAction, fn) {
    if (frameCount % framePerAction == 0)
        fn();
}

function rdm() {
    return Math.random();
}

function vs(speed = 500) {
    return (_p.sin((_dataMngr.getTimeRef() / speed)) + 1) / 2;
}
function vc(speed = 500) {
    return (_p.cos((_dataMngr.getTimeRef() / speed)) + 1) / 2;
}
function vs1(speed = 500) {
    return (_p.sin((_dataMngr.getTimeRef() / speed)));
}
function vc1(speed = 500) {
    return (_p.cos((_dataMngr.getTimeRef() / speed)));
}
function mr(x) {
    return Math.round(x);
}
function easeInOut(x){
    return (1-Math.abs((0.5-x)*2))
}

let logs = "";
function _log(str) {
    logs += str + ";";
}

function isInsideCircles(coords, center, radiusMin, radiusMax) {
    // console.log(coords,center,radiusMin, radiusMax)
    // console.log((_p.sq(coords[0] - center[0]) + _p.sq((coords[1] - center[1]) >= radiusMin * radiusMin )) &&
    // (_p.sq(coords[0] - center[0]) + _p.sq(coords[1] - center[1]) <= radiusMax * radiusMax ));

    return (_p.sq(coords[0] - center[0]) + _p.sq(coords[1] - center[1]) >= radiusMin * radiusMin) &&
        (_p.sq(coords[0] - center[0]) + _p.sq(coords[1] - center[1]) <= radiusMax * radiusMax)
}


function isInsidePoly(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    // https://github.com/substack/point-in-polygon 

    let x,y;
    if(point.x != undefined ||point.y != undefined){
    x = point.x
     y = point.y;
    }
    else{
        x = point[0]
        y = point[1];    
    }

    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        let xi = vs[i][0], yi = vs[i][1];
        let xj = vs[j][0], yj = vs[j][1];

        let intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

function drawGradientTriangle(p, base, vertex, colorBase, colorVertex, steps, gradientFunctions) {
    let gf = gradientFunctions ? gradientFunctions : new Array(4).map(() => (x, i, t) => x)
    //Base to Vertex
    let vectColor = [
        ((colorVertex[0] - colorBase[0]) / steps),
        ((colorVertex[1] - colorBase[1]) / steps),
        ((colorVertex[2] - colorBase[2]) / steps),
        ((colorVertex[3] - colorBase[3]) / steps)
    ];
    let vectFirstSegment = [
        (vertex[0] - base[0][0]) / steps, (vertex[1] - base[0][1]) / steps
    ]
    let vectSecondSegment = [
        (vertex[0] - base[1][0]) / steps, (vertex[1] - base[1][1]) / steps
    ]

    for (let step = 0; step < steps; step++) {
        p.fill([
            colorBase[0] + vectColor[0] * step,
            colorBase[1] + vectColor[1] * step,
            colorBase[2] + vectColor[2] * step,
            colorBase[3] + vectColor[3] * step
        ]);

        p.beginShape();
        //drawBase
        p.vertex(base[0][0] + vectFirstSegment[0] * step, base[0][1] + vectFirstSegment[1] * step);
        p.vertex(base[1][0] + vectSecondSegment[0] * step, base[1][1] + vectSecondSegment[1] * step);

        /*p.text([
            colorBase[0] + vectColor[0]*step,
            colorBase[1] + vectColor[1]*step,
            colorBase[2] + vectColor[2]*step,
            colorBase[3] + vectColor[3]*step
        ],((base[0][0] + vectFirstSegment[0]   *step) + (base[1][0] + vectSecondSegment[0]  *step)) /2,
        ((base[0][1] + vectFirstSegment[0]   *step) + (base[1][1] + vectSecondSegment[0]  *step)) /2);*/

        //draw to temp segment ( tales)
        p.vertex(base[1][0] + vectSecondSegment[0] * (step + 1), base[1][1] + vectSecondSegment[1] * (step + 1));
        p.vertex(base[0][0] + vectFirstSegment[0] * (step + 1), base[0][1] + vectFirstSegment[1] * (step + 1));

        p.endShape(p.CLOSE);
    }
}

function opacityFn(x) {
    // https://www.desmos.com/calculator/mwj90u8atr => f\left(x\right)=103-\frac{100}{x+1}-\frac{x}{101-x}
    return (100 - (255 / x + 1) - (x / (255 - x)))
}

function drawStar(p, x, y, radius1, radius2, npoints,color) {
    p.push()
    p.noStroke()
    p.fill(color)
    let angle = p.TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    p.beginShape();
    for (let a = 0; a < p.TWO_PI; a += angle) {
      let sx = x + p.cos(a) * radius2;
      let sy = y + p.sin(a) * radius2;
      p.vertex(sx, sy);
      sx = x + p.cos(a + halfAngle) * radius1;
      sy = y + p.sin(a + halfAngle) * radius1;
      p.vertex(sx, sy);
    }
    p.endShape(p.CLOSE);
    p.pop()
  }
  