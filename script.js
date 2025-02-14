//UI
const gameUI=function(){
    this.initGrid=function(){
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
    
    //Clean
    this.cleanBoard=function(){
        const gameContainer=document.getElementById('game-container');
        const gameGrid=document.getElementById('game-grid');
        const tilesContainer=document.getElementById('tiles-container');
        const gameOverScreen=document.getElementById('gameover-message');
        gameGrid.innerHTML='';
        tilesContainer.innerHTML='';
        if (gameOverScreen!==null)
            gameContainer.removeChild(gameOverScreen);
    }
    this.cleanMergedTiles=function(gameBoardArray){
        //remove class 'tile-merged'
        //remove the tiles that created the merged tile
        let removeElements=[];
        for (let row=0;row<=3;row++){
            for(let column=0;column<=3;column++){//run all over the board
                let currentCell=gameBoardArray[row][column];
                if (currentCell!==null){//if tile
                    if(Array.isArray(currentCell)){//if array
                        let tile=currentCell[0];
                                let locationStr=(`tile-location-${tile.column}-${tile.row}`);
                                const tilesContainer=document.getElementById('tiles-container');
                                for (let tileElement of tilesContainer.childNodes){
                                    if(tileElement.classList.contains(locationStr)){
                                        if(!(tileElement.classList.contains('merged-tile'))){
                                            removeElements.push(tileElement);
                                        }
                                    }
                                }
                         
                    }
                }
                  
            }
        }
        for (let element of removeElements){
            element.remove();
        }
        const tilesContainer=document.getElementById('tiles-container');
        for (let tileElement of tilesContainer.childNodes){
            tileElement.classList.remove('merged-tile');
        }
    }
    this.cleanNewTileClass=function(){
        const tilesContainer=document.getElementById('tiles-container');
        for (let tileElement of tilesContainer.childNodes){
            tileElement.classList.remove(`new-tile`);
        }
    }

    //Create
    this.createNewTile=function(game){
        this.cleanNewTileClass();
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
                // if (tileInfo.isMerged)
                //     tile.classList.add(`merged-tile`);
                // else
                    tile.classList.add(`new-tile`);
    
                const tileInternal=document.createElement('div');
                tileInternal.innerHTML=parseInt(tileInfo.value);
                tileInternal.classList.add('tile-internal');
                tile.appendChild(tileInternal);
                tilesContainer.appendChild(tile);
            }
        }
    }
    this.createMergedTile=function(tile){
        let locationStr=(`tile-location-${tile.column}-${tile.row}`);
        const tilesContainer=document.getElementById('tiles-container');
        const newTileElement=document.createElement('div');
        newTileElement.classList.add(`tile`);
        if (tile.value<=2048)
            newTileElement.classList.add(`tile-${tile.value}`);
        else
            newTileElement.classList.add(`tile-2048-plus`);
        
        newTileElement.classList.add(locationStr);
        newTileElement.classList.add(`merged-tile`);
    
        const tileInternal=document.createElement('div');
        tileInternal.innerHTML=parseInt(tile.value);
        tileInternal.classList.add('tile-internal');
        newTileElement.appendChild(tileInternal);
        tilesContainer.appendChild(newTileElement);
    }
    this.createPointsAdditionLabel=function(additionValue){
        if(additionValue>0){
            const pointsAdditionLabel=document.createElement('div');
            pointsAdditionLabel.innerHTML=`+${additionValue}`;

            const scoreContainer=document.getElementById('score-container');
            const currentPointsAdditionLabel=document.getElementById('points-addition');
            if (currentPointsAdditionLabel)
                scoreContainer.removeChild(currentPointsAdditionLabel);
            pointsAdditionLabel.id='points-addition';
            scoreContainer.appendChild(pointsAdditionLabel);
        }
    }

    //Update
    this.updateBoard=function(game){
        console.log('_________');
        const tilesCollection=game.tilesCollectionOrderByDirection;//updated tiles info
    
        
    
        const tilesContainer=document.getElementById('tiles-container');
        let tilesElements=tilesContainer.childNodes;
        
        for (let tileInfo of tilesCollection){
            if (Array.isArray(tileInfo)){//if that's a megred tile
                for (let tile of tileInfo){//here tileInfo is an array of 2 merged tiles plus a new one (example: 8,8,16)
                    let lastLocation=tile.lastLocation;
                    if (lastLocation!==null){
                        let lastLocationStr=(`tile-location-${lastLocation.column}-${lastLocation.row}`);
                        for (let tileElement of tilesElements){
                            for (let className of tileElement.classList){
                                if(className===lastLocationStr){
                                    tileElement.classList.remove(className);
                                    let newLocationStr=`tile-location-${tile.column}-${tile.row}`;
                                    tileElement.classList.add(newLocationStr);
                                }    
                            }
                        }
                    }
                    else//new merge   
                        this.createMergedTile(tile);
                    
                }
            }
            else{//if regular
                let lastLocation=tileInfo.lastLocation;
                let lastLocationStr=(`tile-location-${lastLocation.column}-${lastLocation.row}`);
                for (let tileElement of tilesElements){
                    for (let className of tileElement.classList){
                        if(className===lastLocationStr){
                            tileElement.classList.remove(className);
                            let newLocationStr=`tile-location-${tileInfo.column}-${tileInfo.row}`;
                            tileElement.classList.add(newLocationStr);
                        }    
                    }
                }
            }
            
        }
    
        
    }
    this.updateScores=function(score,best){
        const scoreElement=document.getElementById('score-value');
        const bestElement=document.getElementById('best-value');

        let scoreAdditionValue=score-parseInt(scoreElement.innerHTML);
        this.createPointsAdditionLabel(scoreAdditionValue);

        scoreElement.innerHTML=score;
        bestElement.innerHTML=best;
    }
    

    this.displayGameOverMessage=function(){
        const gameContainer=document.getElementById('game-container');
        const messageScreen=document.createElement('div');
        messageScreen.id='gameover-message';
        
        const gameOverLabel=document.createElement('p');
        gameOverLabel.id='gameover-label';
        gameOverLabel.innerHTML='Game Over!';

        const tryAgainButton=document.createElement('button');
        tryAgainButton.id='try-again-button';
        tryAgainButton.innerHTML='Try again';
        

        messageScreen.appendChild(gameOverLabel);
        messageScreen.appendChild(tryAgainButton);

        gameContainer.appendChild(messageScreen);
    }
}
















//Logic
function logic(best){
    this.isGameOverStatus=false;
    this.score=0;
    this.best=best;
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
        const newTileValue=(Math.floor(Math.random() * 100)>=90?'128':'64');
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
        return !((this.gameBoard[row][column] instanceof Tile) || (Array.isArray(this.gameBoard[row][column])));
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


    //Reduce
    this.reduceSingle=function(direction,location){
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
        
        let newLocation={row: newRow,column: newColumn};
        if ((newColumn>3 || newColumn<0 || newRow>3 || newRow<0) ||
        (!this.isCellEmpty(newLocation))){
            return;
        }

        if (this.isCellEmpty(newLocation)){
            let tile=this.getTile(location);
            if (Array.isArray(tile)){
                for (let subTile of tile){//here tile is an array of 3 tiles (example: 8,8,16)
                    subTile.updateTileLocation(newLocation);
                }
            }
            else{
                tile.updateTileLocation(newLocation);
            }
            this.addTile(tile,newLocation);
            this.removeTile(location);
            this.reduceSingle(direction,newLocation);//REC
        }
        
    }
    this.reduceAll=function(direction){

        
        while(this.isReduceAvailableByDirection(direction)){
            for (let row=0;row<=3;row++){
                for (let column=0;column<=3;column++){
                    let currentLocation={row: row,column: column}
                    if(!this.isCellEmpty(currentLocation)){

                           this.reduceSingle(direction,currentLocation);

                       
                    }
                }
            }
            
        }
        this.updateTilesCollectionOrderedByDirection(direction);
    }
    //Merge
    this.mergeSingle=function(direction,location){
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
        (this.isCellEmpty({row: newRow,column: newColumn}))){
            return;
        }
        
        const adjacentLocation={row: newRow,column: newColumn};
        let currentTile=this.getTile(location);
        let adjacentTile=this.getTile(adjacentLocation);
        
        if (Array.isArray(currentTile) || Array.isArray(adjacentTile))//can't merge tiles that already merged
            return;
        if (parseInt(currentTile.value)===parseInt(adjacentTile.value)){
            this.mergeTiles(currentTile,adjacentTile,adjacentLocation);
            this.score+=(parseInt(currentTile.value))*2;
            console.log("Merged!");
        }

    }
    this.mergeTiles=function(oneTile,secondTile,mergingLocation){
        //get 2 tiles and place them into an array with a new merged tile
        //and - remove 2 tiles from his last positions
        let tilesArray=[];
        const newValue=(parseInt(oneTile.value))*2;
        let mergedTile=new Tile(mergingLocation,newValue);
        mergedTile.isMerged=true;
        tilesArray.push(mergedTile,oneTile,secondTile);
        this.removeTile({row:oneTile.row,column:oneTile.column});
        this.removeTile({row:secondTile.row,column:secondTile.column});
        oneTile.updateTileLocation(mergingLocation);
        this.gameBoard[mergingLocation.row][mergingLocation.column]=tilesArray;
        // console.log(this.gameBoard);
        
    }    
    this.mergeAll=function(direction){
        switch (direction){
            case directions.RIGHT:
                for (let column=3;column>=0;column--){
                    for (let row=0;row<=3;row++){
                        let currentLocation={row: row,column: column};
                        if(!this.isCellEmpty(currentLocation))
                            this.mergeSingle(direction,currentLocation);    
                    }
                }
                break;
            case directions.LEFT:
                for (let column=0;column<=3;column++){
                    for (let row=0;row<=3;row++){
                        let currentLocation={row: row,column: column};
                        if(!this.isCellEmpty(currentLocation))
                            this.mergeSingle(direction,currentLocation);    
                    }
                }
                break;
            case directions.UP:
                for (let row=0;row<=3;row++){
                    for (let column=0;column<=3;column++){
                        let currentLocation={row: row,column: column};
                        if(!this.isCellEmpty(currentLocation))
                            this.mergeSingle(direction,currentLocation);    
                    }
                }
                break;
            case directions.DOWN:
                for (let row=3;row>=0;row--){
                    for (let column=0;column<=3;column++){
                        let currentLocation={row: row,column: column};
                        if(!this.isCellEmpty(currentLocation))
                            this.mergeSingle(direction,currentLocation);    
                    }
                }
                break;
        }
        // for (let row=0;row<=3;row++){
        //     for (let column=0;column<=3;column++){
        //         let currentLocation={row: row,column: column}
        //         if(!this.isCellEmpty(currentLocation)){
        //                this.mergeSingle(direction,currentLocation);
        //         }
        //     }
        // }
    }
    this.cleanAllMergedTiles=function(){
        for (let row=0;row<=3;row++){
            for (let column=0;column<=3;column++){
                let currentLocation={row: row,column: column}
                if(Array.isArray(this.getTile(currentLocation))){
                    let mergedArray=this.getTile(currentLocation);
                    for (let tile of mergedArray){
                        if (tile.isMerged){
                            tile.isMerged=false;
                            this.gameBoard[row][column]=tile;//if merge=>replace array with the merged tile
                            break;
                        }       
                    }
                }
            }
        }
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
    this.isReduceAvailableByDirection=function(direction){
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
                //if empty
                if (newColumn<=3 && newColumn>=0 && newRow<=3 && newRow>=0)
                    if (this.isCellEmpty({row: newRow,column: newColumn}))
                        return true;
                }
            }
            return false;
        }
    this.isMoveAvailableByDirection=function(direction){
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
                
                //if empty
                if (newColumn<=3 && newColumn>=0 && newRow<=3 && newRow>=0)
                    if (this.isCellEmpty({row: newRow,column: newColumn})){
                        return true;
                    }
                
                
                //if can be merged
                if (newColumn<=3 && newColumn>=0 && newRow<=3 && newRow>=0){
                    let currentTile=this.getTile(location);

                    let adjacentLocation={row: newRow,column: newColumn};
                    let adjacentTile=this.getTile(adjacentLocation);

                    if (currentTile!==null && adjacentTile!==null){
                        if (Array.isArray(currentTile))
                            currentTile=currentTile.find(tile => tile.isMerged);
                        if (Array.isArray(adjacentTile))
                            adjacentTile=adjacentTile.find(tile => tile.isMerged);
                    }
                        if (parseInt(currentTile.value)===parseInt(adjacentTile.value)){
                            return true;
                        }
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
    this.updateTilesCollectionOrderedByDirection=function(direction){
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
    this.isGameOver=function(){
        for (let [key,value] of Object.entries(directions)){
            if(this.isMoveAvailableByDirection(value))
                return false;
        }
        this.isGameOverStatus=true;
        return true;
    }
}



function Tile(location, value) {
    this.row=location.row;
    this.column=location.column;
    this.value = value;
    this.isMerged = null;//the new tile that created after merging
    this.lastLocation = null;

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
let gameLogic;
let gameGUI;
function newGame(){
    gameLogic=new logic(gameLogic===undefined?0:gameLogic.best);
    gameGUI=new gameUI();
    gameGUI.updateScores(0,gameLogic.best);
    gameGUI.initGrid();
    gameLogic.addRandomTile();
    gameLogic.addRandomTile();
    gameGUI.createNewTile(gameLogic);
}
const newGameButton=document.getElementById('new-game-button');
newGameButton.addEventListener('click',()=>{
    gameGUI.cleanBoard();
    gameGUI.updateScores(0,gameLogic.best);
    newGame();
})


newGame();
window.addEventListener('keydown', function(event) {
    event.preventDefault()
    if (gameLogic.isGameOverStatus)
        return;

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
    if (gameLogic.isMoveAvailableByDirection(direction)){
        
        gameGUI.cleanMergedTiles(gameLogic.gameBoard);
        gameLogic.cleanAllMergedTiles();
        gameLogic.updateAllTilesLastLocation();
        gameLogic.reduceAll(direction);
        
        gameLogic.mergeAll(direction);
        
        gameLogic.updateTilesCollectionOrderedByDirection(direction);
        gameLogic.reduceAll(direction);
        
        gameGUI.updateBoard(gameLogic);
        
        
        
        gameLogic.addRandomTile();
        gameGUI.createNewTile(gameLogic);
        
        
        gameLogic.updateTilesCollectionOrderedByDirection(direction);

        if(gameLogic.score>gameLogic.best)
            gameLogic.best=gameLogic.score;
        console.log(gameLogic.gameBoard);
        gameGUI.updateScores(gameLogic.score,gameLogic.best);
        console.log('Score: ',gameLogic.score);
        console.log('Best: ',gameLogic.best);
    }
    else{
        console.log('NO!');
        
    }

    if(gameLogic.isGameOver()){
        console.log('finito');
        gameGUI.displayGameOverMessage();
        const tryAgainButton=document.getElementById('try-again-button');
        tryAgainButton.addEventListener('click',()=>{
            gameGUI.cleanBoard();
            gameGUI.updateScores(0,gameLogic.best);
            newGame();
        })
    }
        
    
    
})









//test
function autoPlay(speed=1){
    const left=new KeyboardEvent('keydown', {key:'ArrowLeft'});
    const right=new KeyboardEvent('keydown', {key:'ArrowRight'});
    const up=new KeyboardEvent('keydown', {key:'ArrowUp'});
    const down=new KeyboardEvent('keydown', {key:'ArrowDown'});

    setTimeout(function(){window.dispatchEvent(left)},100*speed);
    setTimeout(function(){window.dispatchEvent(right)},200*speed);
    setTimeout(function(){window.dispatchEvent(up)},300*speed);
    setTimeout(function(){window.dispatchEvent(down)},400*speed);

    if(!gameLogic.isGameOverStatus)
        setTimeout(function(){autoPlay(speed);},500*speed);
}
window.addEventListener('keydown', function(event) {
    const key = event.code;
    if (key==='Space'){
        autoPlay(3);
    }
        
});