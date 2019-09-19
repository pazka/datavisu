

//https://opendata.paris.fr/explore/dataset/velib-disponibilite-en-temps-reel/information/

class DataAir extends Data{
    constructor(data,date,lifespan){
        super(data,date,lifespan,_p.width/2,_p.height/2);
    }

    draw(p){
        let x = (this.age/this.life);
        Air.drawGlobal(p,this)
		// _shaderMngr.shaders.snow.run({
		// 	iTime : _dataMngr.getTimeRef()/1500,
        //     iResolution : [_map.dimension.width,_map.dimension.height],
        //     iVar : p.mouseX / p.width
		// })
        // _shaderMngr.drawBuffer()
		// p.blendMode(p.HARD_LIGHT)
    }
}

class Air extends DataType{
    static get type () { return "Air"}
    static get json () { return  import_air_json}
    __dateBounds = null
    static get dateBounds () { return  this.__dateBounds}
    static set dateBounds (e) { this.__dateBounds = e}

    //drawing related var
    __dataFadeLeft = 0
    static get dataFadeLeft () { return  this.__dataFadeLeft}
    static set dataFadeLeft (d) { this.__dataFadeLeft = d}

    __lastData
    static get lastData () { return  this.__lastData}
    static set lastData (l) { this.__lastData = l}

    static preloadData(){
        let nb = 0
        Air.json.forEach(data =>{
            if(Air.exclude(data))
                return;
            nb++
            data.fields.valeur = (10-data.fields.valeur) /10
        });
        Air.nbData = nb
    }

    static drawGlobal(p,data){
        if(!this.lastData)
            Air.dataFadeLeft = 0
        else
            Air.dataFadeLeft += this.lastData.rawData.fields.valeur - data.rawData.fields.valeur 
        
        Air.dataFadeLeft *= 0.65
        this.lastData = data

		_shaderMngr.shaders.storm.run({
			iTime : _dataMngr.getTimeRef()/800,
			iResolution : [_map.dimension.width,_map.dimension.height],
            iVar : data.rawData.fields.valeur + Air.dataFadeLeft
        })
        _shaderMngr.drawBuffer()
		p.blendMode(p.HARD_LIGHT)
    }
    

    static getDateBounds(){
        if(Air.dateBounds != null)
            return Air.dateBounds

        let dateBounds = {minDate : Infinity, maxDate : 0}
        Air.json.forEach(data =>{
            if(Air.exclude(data))
                return;

            let tmp_d = (new Date(data.fields.date_echeance)).getTime() ;
            if(tmp_d < dateBounds.minDate){
                dateBounds.minDate = tmp_d;
            }
            if(tmp_d > dateBounds.maxDate){
                dateBounds.maxDate = tmp_d;
            }
        });

        Air.dateBounds = dateBounds
        return dateBounds;
    }

    static browse(fn){
        Air.json.forEach(data =>{

           if(Air.exclude())
               return;

           let tmp_d = _dataMngr.getRelTime((new Date(data.fields.date_echeance).getTime()));
            fn(
                new DataAir(data,tmp_d,_dataMngr.datesBounds.totalTimeLength / Air.nbData)
            );
       });
    }

    static exclude(data){
        return;
    }
}