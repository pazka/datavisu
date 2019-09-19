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
        this.shaders.storm2 = new ShaderStorm2(this.masterP5,this.p)
        this.shaders.snow = new ShaderSnow(this.masterP5,this.p)
    }
    drawBuffer(){
        this.masterP5.image(this.p,0,0)
    }

    resetShader(){
        this.p.resetShader();
    }
}

//TODO 

class Shader{
    p
    shader 
    
    constructor(masterP5, p){
        this.p = p
    //    this.shader.setUniform('iResolution',[p.width,p.height])
    }

    run (uniforms){
        if(uniforms == null){
            console.log("Run : No property to iterate on. If it's empty put at least {}")
            return;
        }

        for (var uniform in uniforms) {
            if (Object.prototype.hasOwnProperty.call(uniforms, uniform)) {
                this.shader.setUniform(uniform,uniforms[uniform])
            }
        }

        this.p.quad(0,0,this.p.width,0,this.p.width,this.p.height,0,this.p.height)
        this.p.shader(this.shader)
    }

    update (uniforms){
        if(uniforms == null){
            console.log("Update : No property to iterate on. If it's empty put at least {}")
            return;
        }

        for (var uniform in uniforms) {
            if (Object.prototype.hasOwnProperty.call(uniforms, uniform)) {
                this.shader.setUniform(uniform,uniforms[uniform])
            }
        }
    }
}

class ShaderStorm extends Shader{
    constructor(masterP5, p){
        super(masterP5,p);
        this.shader = masterP5.loadShader("js/shaders/datavisu.shader.storm.vert","js/shaders/datavisu.shader.storm.frag")
    }
}
class ShaderSnow extends Shader{
    constructor(masterP5, p){
        super(masterP5,p);
        this.shader = masterP5.loadShader("js/shaders/datavisu.shader.snow.vert","js/shaders/datavisu.shader.snow.frag")
    }
}
class ShaderStorm2 extends Shader{
    constructor(masterP5, p){
        super(masterP5,p);
        this.shader = masterP5.loadShader("js/shaders/datavisu.shader.storm2.vert","js/shaders/datavisu.shader.storm2.frag")
    }
}