class DataTraveler extends Data{
    pos

    constructor(date,life,pos){
        super(date,life,pos.x,pos.y);
        this.pos = pos;
    }

    draw(p){
        console.log("im here !")
        _flock.objective = this.pos
    }
}

let _allTravelerLength = 0;

class Traveler extends DataType{
    type = "Traveler";

    static browse(json,fn){
        let indexToCall = 0;
        let _allTravelerLength = 0;

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
                    new DataTraveler((_dataMngr.datesBounds.totalTimeLength / _allTravelerLength)*indexToCall,
                        (_dataMngr.datesBounds.totalTimeLength / _allTravelerLength),
                        [_map.getX(data.geometry.coordinates[0]),_map.getY(data.geometry.coordinates[1])])
                );
                indexToCall++
        });
    }
}
