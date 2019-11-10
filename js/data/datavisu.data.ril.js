//https://opendata.paris.fr/explore/dataset/ril-disponibilite-en-temps-reel/information/
class DataRil extends Data {
    size;
    colors;
    type = "Ril"

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

        drawStarGradient(p, this.pos.x, this.pos.y,
            3, 
            this.noise *10* easeInOut(x), 
            this.noise * 20/ 100  ,
            [255,255,255, 255 * easeInOut(x)],
            [25,25,255, 255 * easeInOut(x)],
            3
        )
    
        
        // super.draw(p);
    }
}

class Ril extends DataType {
    type = "Ril";
    static get avgLife() { return _dataMngr.datesBounds.totalTimeLength / 40 };
    static get json() { return import_ril_json }
    __dateBounds = null
    static get dateBounds() { return this.__dateBounds }
    static set dateBounds(e) { this.__dateBounds = e }

    static preloadData() {
        Ril.nbData = Ril.json.length
    }

    static getDateBounds() {
        if (Ril.dateBounds != null)
            return Ril.dateBounds

        let dateBounds = { minDate: Infinity, maxDate: 0 }

        Ril.json.forEach(data => {

            let tmp_d = new Date(data.properties.ANNEE_CONS, 0,0).getTime();

            if (tmp_d < dateBounds.minDate) {
                dateBounds.minDate = tmp_d;
            }
            if (tmp_d > dateBounds.maxDate) {
                dateBounds.maxDate = tmp_d;
            }
        });
        dateBounds.dateSpan = dateBounds.maxDate - dateBounds.minDate;
        Ril.dateBounds = dateBounds
        return dateBounds;
    }

    static browse(fn) {
        Ril.json.forEach(data => {
            let pos_tmp = [
                _map.getX(data.geometry.coordinates),
                _map.getY(data.geometry.coordinates)
            ]

            let tmp_d =  _dataMngr.getRelTime(new Date(data.properties.ANNEE_CONS, 0,0).getTime());
            fn(

                new DataRil(data,
                    tmp_d,
                    Ril.avgLife,
                    pos_tmp[0],
                    pos_tmp[1],
                    19)
            );
        });
    }
}