class DataTraveler extends Data{
    pos

    constructor(rawData,date,life,pos){
        super(rawData,date,life,pos.x,pos.y);
        this.pos = pos;
    }

    draw(p){
      /*  p.fill([255,0,0])
        p.ellipse(this.pos[0], this.pos[1],5,5)*/
        _flock.objective = this.pos
    }
}

let _allTravelerLength = 0;

class Traveler extends DataType{
    type = "Traveler";

    static browse(json,fn){
        let indexToCall = 0;
        let _allTravelerLength = 0;
        _filterNumber = 10;

        json.forEach(data =>{
            if(Traveler.exclude([_map.getX(data.geometry.coordinates[0]),_map.getY(data.geometry.coordinates[1])]))
               return;

            _allTravelerLength++;
        })

        json.forEach(data =>{
            
            //orchestrate data
            if(Traveler.exclude([_map.getX(data.geometry.coordinates[0]),_map.getY(data.geometry.coordinates[1])]))
                return;
            
                fn(
                    new DataTraveler(
                        data,
                        (_dataMngr.datesBounds.totalTimeLength / _allTravelerLength)*indexToCall,
                        (_dataMngr.datesBounds.totalTimeLength / _allTravelerLength),
                        [_map.getX(data.geometry.coordinates[0]),_map.getY(data.geometry.coordinates[1])])
                );
                indexToCall++
        });
    }

    static exclude(pos){
        _nb = (_nb+ 1) % _filterNumber
        return super.exclude(pos) || _nb != 0
    }
}
