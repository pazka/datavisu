class NoiseLoop {

    constructor(diameter, min, max) {
        this.diameter = diameter;
        this.min = min;
        this.max = max;
        this.cx = _p.random(1000);
        this.cy = _p.random(1000);
    }

    value(a_) {
        this.a = a_;
        this.xoff = _p.map(_p.cos(this.a), -1, 1, this.cx, this.cx + this.diameter);
        this.yoff = _p.map(_p.sin(this.a), -1, 1, this.cy, this.cy + this.diameter);
        this.r = _p.noise(this.xoff, this.yoff);
        return _p.map(this.r, 0, 1, this.min, this.max);
    }
}

class Particle {

    constructor() {

        this.xNoise = new NoiseLoop(0.5, -width, width * 2);
        this.yNoise = new NoiseLoop(0.5, -height, height * 2);
        this.dNoise = new NoiseLoop(7, 10, 120);
        this.rNoise = new NoiseLoop(7, 100, 255);
        this.bNoise = new NoiseLoop(7, 100, 255);
        this.phase = 0;
        this.zoff = 0;
        this.rot = _p.random(10, 20);
    }

    render(a_) {

        this.a = a_;
        this.x = this.xNoise.value(this.a);
        this.y = this.yNoise.value(this.a);
        this.d = this.dNoise.value(this.a);
        this.r = this.rNoise.value(this.a);
        this.b = this.bNoise.value(this.a);
        //
        //ellipse(x, y, d, d);

        this.phase += 0.003;
        this.zoff += 0.01;

    }

    display() {
        //stroke(this.r, this.b, 10, 200);
        //strokeWeight(1);
        _p.noStroke();
        _p.fill(this.r - 10, this.b - 10, this.d + 200, 200);
        _p.beginShape();
        let noiseMax = slider.value();
        for (let i = 0; i < TWO_PI; i += radians(5)) {
            let size = 0.0025;
            let xoff = _p.map(_p.cos(i + this.phase), -1, 1, 0, noiseMax);
            let yoff = _p.map(_p.sin(i + this.phase), -1, 1, 0, noiseMax);
            let r1 = _p.map(_p.noise(xoff, yoff, this.zoff), 0, 1, 100, height / 2);

            let x = this.d * size * r1 * _p.cos(i + this.rot) + this.x;
            let y = this.d * size * r1 * _p.sin(i + this.rot) + this.y;
            _p.vertex(x, y);
        }
        _p.endShape(CLOSE);
    }

}

function drawConcentricLines(p, center, length, lengthVariance, padding, paddingVariance, widthRect, nbLines, opacity = 255) {
    let img = p.createGraphics((length + padding + lengthVariance + paddingVariance + 50) * 2, (length + padding + lengthVariance + paddingVariance + 50) * 2)

    img.translate(img.width / 2, img.height / 2);
    let angle = (360) * vs(1000000000)

    img.noStroke()
    for (let i = 0; i < nbLines; i++) {
        img.rotate(angle * vs(5000000000) + i)
        let vari = (i * 100) % 255
        img.fill([200 + (i) % 55, (i * 12) % 205, (i * 23) % 55, opacity])
        img.rect((vs1(5000) * img.width / 20) - widthRect / 2, padding + (i % paddingVariance * (vs(8000) + 1)) + padding, widthRect, length + (i % lengthVariance * vc(9000)))
    }
    p.image(img, center[0] - img.width / 2, center[1] - img.height / 2, img.width, img.height)

    img.remove()
}


function stupidCircle(p,x,y,size,color){
    p.push()
    p.fill(color)
    p.ellipse(x,y,size)
    p.pop()
}

function drawTarget(p, xloc, yloc, size, num, color, opacity = 255) {
    p.noStroke();
    const steps = size / num;
    for (let i = 0; i < num; i++) {
        p.fill(color[0] * i / num, color[1] * i / num, color[2] * i / num, opacity * (i / num));
        p.ellipse(xloc, yloc, size - i * steps, size - i * steps);
    }
}
function drawTargetBis(p, xloc, yloc, size, num, colors, opacity) {
    p.noStroke();
    const steps = size / num;
    for (let i = 0; i < num; i++) {
        p.fill(colors[i][0], colors[i][1], colors[i][2], opacity);
        p.ellipse(xloc, yloc, size - i * steps, size - i * steps);
    }
}