class ShaderManager{
    p
    shaders = {}

    constructor(p){
        this.p = p   
    }

    loadShaders(){
        this.shaders.storm = this.p.loadShader("js/shaders/datavisu.shader.storm.glsl","js/shaders/datavisu.shader.storm.glsl")
        this.p.shader(this.shaders.storm)
    } 
}