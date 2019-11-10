//https://opendata.paris.fr/explore/dataset/sirene-disponibilite-en-temps-reel/information/
class DataSirene extends Data {
    size;
    colors;
    type = "Sirene"

    constructor(rawData, date, life, x, y, _size = 15) {
        super(rawData, date, life, x, y);
        this.size = _size;
        this.colors =
            Array.from(
                Array(
                    2 + Math.round(
                        rdm() * 5
                    )
                ).keys()
            ).map(i => [rdm() * 255, rdm() * 255, rdm() * 255])
    }

    draw(p) {
        let x = (this.age / this.life);
 
        drawStar(p, this.pos.x, this.pos.y, 1, 2* easeInOut(x), this.noise/100*5,
            [255,255,255, 255 * easeInOut(x)]
            )
            /*
        drawStarGradient(p, this.pos.x, this.pos.y,
            3, 
            this.noise *10* easeInOut(x), 
            this.noise * 20/ 100  ,
            [255,255,255, 255 * easeInOut(x)],
            [25,25,255, 255 * easeInOut(x)],
            3
        )
*/
        //super.draw(p);
    }
}

class Sirene extends DataType {
    type = "Sirene";
    static get avgLife() { return _dataMngr.datesBounds.totalTimeLength / 100 };
    static get json() { return import_sirene_json }
    __dateBounds = null
    static get dateBounds() { return this.__dateBounds }
    static set dateBounds(e) { this.__dateBounds = e }

    static preloadData() {
        Sirene.nbData = Sirene.json.length
    }

    static getDateBounds() {
        if (Sirene.dateBounds != null)
            return Sirene.dateBounds

        let dateBounds = { minDate: Infinity, maxDate: 0 }

        Sirene.json.forEach(data => {

            let tmp_d = new Date(data.properties.DCRET.substring(0, 4), data.properties.DCRET.substring(4, 6), data.properties.DCRET.substring(6, 8)).getTime();


            if (tmp_d < dateBounds.minDate) {
                dateBounds.minDate = tmp_d;
            }
            if (tmp_d > dateBounds.maxDate) {
                dateBounds.maxDate = tmp_d;
            }
        });
        dateBounds.dateSpan = dateBounds.maxDate - dateBounds.minDate;
        Sirene.dateBounds = dateBounds
        return dateBounds;
    }

    static browse(fn) {
        Sirene.json.forEach(data => {
            let pos_tmp = [
                _map.getX(data.geometry.coordinates),
                _map.getY(data.geometry.coordinates)
            ]

            let tmp_d = _dataMngr.getRelTime(new Date(data.properties.DCRET.substring(0, 4), data.properties.DCRET.substring(4, 6), data.properties.DCRET.substring(6, 8)).getTime());
            fn(

                new DataSirene(data,
                    tmp_d,
                    Sirene.avgLife,
                    pos_tmp[0],
                    pos_tmp[1],
                    19)
            );
        });
    }
}