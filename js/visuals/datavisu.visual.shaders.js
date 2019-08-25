class ShaderManager{
    masterP5
    p
    shaders = {}

    constructor(p,width,height){
        this.masterP5 = p;
        this.p = p.createGraphics(width,height,p.WEBGL)
    }

    loadShaders(){
        this.shaders.storm = new ShaderStorm(this.masterP5,this.p)
    }
    drawBuffer(){
        this.masterP5.image(this.p,0,0)
    }

    resetShader(){
        this.p.resetShader();
    }
}

let _incr = 0;
class ShaderStorm{
    p
    shader 
    
    constructor(masterP5, p){
        this.p = p
        this.shader = masterP5.loadShader("js/shaders/datavisu.shader.storm.vert","js/shaders/datavisu.shader.storm.frag")
    //    this.shader.setUniform('iResolution',[p.width,p.height])
    }

    run (){
        this.shader.setUniform('iTime',_dataMngr.getTimeRef()/2000)
        this.shader.setUniform('iResolution',[this.p.width,this.p.height])
        this.p.quad(0,0,this.p.width,0,this.p.width,this.p.height,0,this.p.height)
        this.p.shader(this.shader)
    }

    update (){
        this.shader.setUniform('iTime',_dataMngr.getTimeRef()/2000)
    }
}