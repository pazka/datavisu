class ShaderManager{
    p
    shaders = {}

    constructor(p){
        this.p = p   
    }

    loadShaders(){
        this.shaders.storm = new ShaderStorm(this.p)
    }
}

class ShaderStorm{
    p
    shader 
    
    constructor(p){
        this.p = p   
        this.shader = this.p.loadShader("js/shaders/datavisu.shader.storm.vert","js/shaders/datavisu.shader.storm.frag")
        this.shader.setUniform('iResolution',[p.width,p.height])
    }

    run (){
        this.shader.setUniform('iTime',_dataMngr.getTimeRef())
        this.p.shader(this.shader)
    }
}