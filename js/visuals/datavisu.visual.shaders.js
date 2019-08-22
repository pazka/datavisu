class ShaderManager{
    p
    shaders = {}

    constructor(p){
        this.p = p   
    }

    loadShaders(){
        this.shaders.storm = new ShaderStorm(this.p)
    }

    resetShader(){
        this.p.resetShader();
    }
}

let _incr = 0;
class ShaderStorm{
    p
    shader 
    
    constructor(p){
        this.p = p   
        this.shader = this.p.loadShader("js/shaders/datavisu.shader.storm.vert","js/shaders/datavisu.shader.storm.frag")
    //    this.shader.setUniform('iResolution',[p.width,p.height])
    }

    run (){
        // this.shader.setUniform('iTime',_dataMngr.getTimeRef())
        this.shader.setUniform('iTime',_dataMngr.getTimeRef()/1000)
        this.p.shader(this.shader)
    }

    update (){
        this.shader.setUniform('iTime',_dataMngr.getTimeRef()/1000)
    }
}