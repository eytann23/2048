//UI
const initGrid=function(){
    const gameGrid=document.getElementById('game-grid');
    for (let row=0;row<=3;row++){
        for (let column=0;column<=3;column++){
            const cell=document.createElement('div');
            //const cellId=`location-${row}-${column}`;
            //cell.setAttribute('id',cellId);
            cell.classList.add('cell');
            gameGrid.appendChild(cell);
        }
        
    }
}
    
const updateBoard=function(game){
    console.log('_________');
    const tilesCollection=game.tilesCollectionOrderByDirection;//updated tiles info
    console.log(tilesCollection);
    

    const tilesContainer=document.getElementById('tiles-container');
    let tilesElements=tilesContainer.childNodes;
    
    for (let tileInfo of tilesCollection){
        let lastLocation=tileInfo.lastLocation;
        
        
        
            let lastLocationStr=(`tile-location-${lastLocation.column}-${lastLocation.row}`);

            console.log("Last:", lastLocationStr);
            
            for (let tileElement of tilesElements){
                // console.log(tileElement.classList);
                for (let className of tileElement.classList){

                    if(className===lastLocationStr){
                        console.log("Last:", lastLocationStr);
                        tileElement.classList.remove(className);
                        
                        let newLocationStr=`tile-location-${tileInfo.column}-${tileInfo.row}`;
                        tileElement.classList.add(newLocationStr);
                        // console.log("New:",newLocationStr);
                    }
                    
                        
                }
            
            }
        
        
        
            // console.log(tilesElements);
    }

    
}
const cleanNewTileClass=function(){
    const tilesContainer=document.getElementById('tiles-container');
    for (let tileElement of tilesContainer.childNodes){
        tileElement.classList.remove(`new-tile`);
    }
}
const updateNewTile=function(game){
    cleanNewTileClass();
    const tilesCollection=game.getTilesCollection();//updated tiles info
    const tilesContainer=document.getElementById('tiles-container');
    // let tilesElements=tilesContainer.childNodes;
    for (let tileInfo of tilesCollection){
        let lastLocation=tileInfo.lastLocation;
        //new
        if(lastLocation===null){
            const tile=document.createElement('div');
            tile.classList.add(`tile`);
            tile.classList.add(`tile-${tileInfo.value}`);
            tile.classList.add(`tile-location-${tileInfo.column}-${tileInfo.row}`);
            tile.classList.add(`new-tile`);

            const tileInternal=document.createElement('div');
            tileInternal.innerHTML=parseInt(tileInfo.value);
            tileInternal.classList.add('tile-internal');
            tile.appendChild(tileInternal);
            tilesContainer.appendChild(tile);
        }
    }
}




//Logic
function logic(){
    this.gameBoard=[
        [null,null,null,null],
        [null,null,null,null],
        [null,null,null,null],
        [null,null,null,null]
    ];

    this.addRandomTile = function(){
        let isCellEmpty=false;
        let row,column;
        if (!this.isAnyCellEmpty()){
            console.log('game over!');
            return;
        }
        while (!isCellEmpty){
            row = Math.floor(Math.random() * 4);
            column = Math.floor(Math.random() * 4);
            if (this.gameBoard[row][column]===null)
                isCellEmpty=true;
        }
        const newTileValue=(Math.floor(Math.random() * 100)>=90?'4':'2');
        const location={row,column};
        this.gameBoard[row][column]=new Tile(location,newTileValue);
        //console.log(`new: `,{row,column});
        
    }
    this.isAnyCellEmpty=function(){
        for (let row=0;row<=3;row++){
            for (let column=0;column<=3;column++){
                const cell=this.gameBoard[row][column];
                if (cell===null)
                    return true;
            }
        }
        return false;
    }
    this.isCellEmpty=function(location){
        let row = location.row;
        let column = location.column;
        return !(this.gameBoard[row][column] instanceof Tile);
    }
    this.removeTile=function(location){
        this.gameBoard[location.row][location.column]=null;
    }

    this.addTile=function(tile,location){
        this.gameBoard[location.row][location.column]=tile;
    }
    
    this.getTile=function(location){
        return this.gameBoard[location.row][location.column];
    }
    
    this.moveSingle=function(direction,location,){
        let newRow,newColumn;

        switch (direction){
            case directions.RIGHT:
                newRow = location.row;
                newColumn = location.column+1;
                break;
            case directions.LEFT:
                newRow = location.row;
                newColumn = location.column-1;
                break;
            case directions.UP:
                newRow = location.row-1;
                newColumn = location.column;
                break;
            case directions.DOWN:
                newRow = location.row+1;
                newColumn = location.column;
                break;
        }
        
        if ((newColumn>3 || newColumn<0 || newRow>3 || newRow<0) ||
        (!this.isCellEmpty({row: newRow,column: newColumn}))){
            return;
        }

        if (this.isCellEmpty({row: newRow,column: newColumn})){
            let tile=this.getTile(location);
            tile.updateTileLocation({row: newRow,column: newColumn});
            this.addTile(tile,{row: newRow,column: newColumn});
            this.removeTile(location);
            this.moveSingle(direction,{row: newRow,column: newColumn});//REC
        }
        
    }

    this.moveAll=function(direction){
        this.updateAllTilesLastLocation();
        while(this.isDirectionMoveAvailable(direction)){
            for (let row=0;row<=3;row++){
                for (let column=0;column<=3;column++){
                    let currentLocation={row: row,column: column}
                    if(!this.isCellEmpty(currentLocation)){
                        // if(this.isTileCanMoveByDirection({row: row,column: column},direction)){
                           // console.log(this.isTileCanMoveByDirection({row: row,column: column},direction));
                           
                           this.moveSingle(direction,currentLocation);

                        // }
                       
                    }
                }
            }
            
        }
        this.updateTilesCollectionOrderByDirection(direction);
    }
    this.updateAllTilesLastLocation=function(){
        for (let row=0;row<=3;row++){
            for (let column=0;column<=3;column++){
                let location={row: row,column: column};
                if(!this.isCellEmpty(location)){
                    let tile=this.getTile(location);
                    tile.lastLocation=location;
                }
            }
        }
    }

    this.isDirectionMoveAvailable=function(direction){
        let newRow,newColumn;
        for (let row=0;row<=3;row++){
            for (let column=0;column<=3;column++){
                let location={row: row,column:column};
                if(this.isCellEmpty(location)) continue;
                switch (direction){
                    case directions.RIGHT:
                        newRow = location.row;
                        newColumn = location.column+1;
                        break;
                    case directions.LEFT:
                        newRow = location.row;
                        newColumn = location.column-1;
                        break;
                    case directions.UP:
                        newRow = location.row-1;
                        newColumn = location.column;
                        break;
                    case directions.DOWN:
                        newRow = location.row+1;
                        newColumn = location.column;
                        break;
                }
        
                if (newColumn<=3 && newColumn>=0 && newRow<=3 && newRow>=0)
                    if (this.isCellEmpty({row: newRow,column: newColumn})){
                        //console.log(`row: ${newRow} column: ${newColumn}`);
                        return true;
                    }
            }
            
        }
        return false;
    }
    this.isTileCanMoveByDirection=function(location,direction){
        let newRow,newColumn;
        switch (direction){
            case directions.RIGHT:
                newRow = location.row;
                newColumn = location.column+1;
                break;
            case directions.LEFT:
                newRow = location.row;
                newColumn = location.column-1;
                break;
            case directions.UP:
                newRow = location.row-1;
                newColumn = location.column;
                break;
            case directions.DOWN:
                newRow = location.row+1;
                newColumn = location.column;
                break;
        }
        if (newColumn<=3 && newColumn>=0 && newRow<=3 && newRow>=0)
            if (this.isCellEmpty({row: newRow,column: newColumn}))
                return true;
            
        return false;
    }
    this.getTilesCollection=function(){
        let tilesCollection=[];
        for (let row=0;row<=3;row++){
            for (let column=0;column<=3;column++){
                let location={row:row,column:column};
                if(this.getTile(location)!==null)
                    tilesCollection.push(this.getTile(location));
            }
        }
        return tilesCollection;
    }
    this.tilesCollectionOrderByDirection=[];
    this.updateTilesCollectionOrderByDirection=function(direction){
        let tilesCollection=[];
        switch (direction){
            case directions.RIGHT:
                for (let column=3;column>=0;column--){
                    for (let row=0;row<=3;row++){
                        let location={row:row,column:column};
                        if(this.getTile(location)!==null)
                        tilesCollection.push(this.getTile(location));
                    }
                }
                break;
            case directions.LEFT:
                for (let column=0;column<=3;column++){
                    for (let row=0;row<=3;row++){
                        let location={row:row,column:column};
                        if(this.getTile(location)!==null)
                        tilesCollection.push(this.getTile(location));
                    }
                }
                break;
            case directions.UP:
                for (let row=0;row<=3;row++){
                    for (let column=0;column<=3;column++){
                        let location={row:row,column:column};
                        if(this.getTile(location)!==null)
                            tilesCollection.push(this.getTile(location));
                    }
                }
                break;
            case directions.DOWN:
                for (let row=3;row>=0;row--){
                    for (let column=0;column<=3;column++){
                        let location={row:row,column:column};
                        if(this.getTile(location)!==null)
                            tilesCollection.push(this.getTile(location));
                    }
                }
                break;
        }

        this.tilesCollectionOrderByDirection=tilesCollection;
    }
}



function Tile(location, value) {
    this.row=location.row;
    this.column=location.column;
    this.value = value;

    this.lastLocation = null;
    //this.merged


    this.updateTileLocation=function(location){
        this.row=location.row;
        this.column=location.column;
    }
}


const directions={
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
}

















//Main
const game=new logic();
initGrid();
game.addRandomTile();
updateNewTile(game);
// game.moveAll(direction);
console.log(game.gameBoard);
// window.addEventListener('click',()=>{
//     game.addRandomTile();
//     updateBoard(game.gameBoard);
// })



let isLeft=true;
const tilesContainer=document.getElementById('tiles-container');




window.addEventListener('keydown', function(event) {
    event.preventDefault()
    const key = event.key;
    let direction;
    switch (key) { 
        case "ArrowLeft": 
            direction = directions.LEFT;
            break; 
        case "ArrowRight": 
            direction = directions.RIGHT;
            break; 
        case "ArrowUp": 
            direction = directions.UP;
            break; 
        case "ArrowDown": 
            direction = directions.DOWN;
            break; 
    }
    if (game.isDirectionMoveAvailable(direction)){
        game.moveAll(direction);
        updateBoard(game);
        game.addRandomTile();
        updateNewTile(game);
        console.log(game.gameBoard);
    }
    else{
        console.log('GAME OVER');
        
    }
    
    
})

window.addEventListener('keydown', function(event) {
    // if(event.code==='Space')
        // game.addRandomTile();
        // updateBoard(game.gameBoard);
})





