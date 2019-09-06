

//https://opendata.paris.fr/explore/dataset/velib-disponibilite-en-temps-reel/information/

class DataSound extends Data{
    constructor(date){
        super(null,date,_dataMngr.datesBounds.totalTimeLength,_p.width/2,_p.height/2);
    }

    draw(p){
        let x = (this.age/this.life);

		// _shaderMngr.shaders.storm.run({
		// 	iTime : _dataMngr.getTimeRef()/800,
		// 	iResolution : [_map.dimension.width,_map.dimension.height],
		// 	iMouse : [p.mouseX,p.mouseY]
		// })
		_shaderMngr.shaders.snow.run({
			iTime : _dataMngr.getTimeRef()/1500,
			iResolution : [_map.dimension.width,_map.dimension.height],
		})
        _shaderMngr.drawBuffer()
		p.blendMode(p.HARD_LIGHT)
    }
}

class Sound extends DataType{
    type = "Sound";


    
    static getBounds(json,dateBounds){/*
        json.forEach(data =>{
            if(Sound.exclude(data))
                return;

            let tmp_d = (new Date(data.timestamp)).getTime() ;


            if(tmp_d < dateBounds.minDate){
                dateBounds.minDate = tmp_d;
            }
            if(tmp_d > dateBounds.maxDate){
                dateBounds.maxDate = tmp_d;
            }
        });

        return dateBounds;*/
    }

    static browse(json,fn){
       // json.forEach(data =>{

          //  if(Sound.exclude())
            //    return;

           // let tmp_d = _dataMngr.getRelTime((new Date(data.timestamp)).getTime());
            let tmp_d = _dataMngr.getTimeRef();
            fn(
                new DataSound(tmp_d)
            );
       // });
    }
}