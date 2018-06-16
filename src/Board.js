import React from 'react';
import { Square } from './Square';
import { Modal, Button, Menu, Icon } from 'antd';
import './index.css';
import './board.css';



//main board component with game logic
export default class Board extends React.Component{
  constructor(props){
    super(props);
    this.state = { 
      'player':'W',
      'phase':0,
      'whitePieces':this.initializeStack(),
      'blackPieces':this.initializeStack(),      
      //this sets up an empty board
      //"+"" represenets an empty square
      //"X" represents water squares on that pieces cannot move
      // Each piece contains info about player - @prop player ("B" or "W")
      // and info about piece itself @ prop piece (numbers 1-9, S,B,F)

      'grid':this.newBoard(),
      'selected':"",
      'target': "",
    };
    localStorage.setItem('from', "")
  }

  //initialize stack of pieces (numbers) that each player fills onto board
  initializeStack(){
    var stack = [];
    stack.push("1");
    stack.push("2");
    for(var i = 0; i < 2; i++ )
      stack.push("3");
    for(var j = 0; j < 3; j++ )
      stack.push("4");
    for(var k = 0; k < 4; k++ )
      stack.push("5");
    for(var l = 0; l < 4; l++ )
      stack.push("6");
    for(var m = 0; m < 4; m++ )
      stack.push("7");
    for(var n = 0; n < 5; n++ )
      stack.push("8");
    for(var o = 0; o < 8; o++ )
      stack.push("9");
    stack.push("S");      
    for(var p = 0; p < 6; p++ )
      stack.push("B");
    stack.push("F");
    return stack;
  }

  //helper function to randomize pieces order when generating automatical piece positions
  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  }

  //fill the board randomly with pieces 
  initializeAutomatically(){
    let newGrid = this.state.grid;
    let positionBounds;
    let pieces = this.initializeStack(); 
    this.shuffleArray(pieces);
    if(this.state.phase !== 0){
      return
    }

    //set bounds where all the pieces could be placed
    if(this.state.player === 'W'){
      positionBounds = {'min' : 6, 'max' : 9}
    }else{
      positionBounds = {'min' : 0, 'max' : 3};
    }

    //place the pieces
    this.state.grid.forEach((element,index)=> {
      if(index >= positionBounds.min && index <= positionBounds.max){
        element.forEach(
          (square, yIndex) => {
            newGrid[index][yIndex] = {'player': this.state.player, 'piece': pieces.pop()}
          }) 

      }
    });
    this.setState({'grid': newGrid})

    //change the state of the game and show modal dialogs
    if(this.state.player === 'W'){
      Modal.info({
        title: 'Second player is setting up his board',
        onOk() {},
      })
      this.setState({'whitePieces':[], 'player':'B'}) 
    }else{
      Modal.info({
        title: 'Good luck with playing',
        onOk() {},
      })
      this.setState({'blackPieces':[], 'player':'W', 'phase':1 })
    }

  }


  handleMenuClick = (e) => {
    console.log(e.key)
    if(e.key === "restart"){
      this.handleReset()
    }
    if(e.key === "generate"){
      this.initializeAutomatically()
    }
  }
  //function that creates empty array representing board with no pieces filled
  //@returns array without pieces
  newBoard(){
    var arr = Array(10).fill().map(x => Array(10).fill("+"));
    arr[4][2] = arr[4][3] = arr[5][2] = arr[5][3] = "X";
    arr[4][6] = arr[4][7] = arr[5][6] = arr[5][7] = "X";

    return arr;
  }

  // //generate a new empty grid and set it to the grid state with setState
  handleReset(){
    this.setState({'phase':0 , 'grid':this.newBoard()});
  }

  handleMove(){
    const board = this
    setTimeout(function(){    
    board.setState({'player': 'None', previous: board.state.player})
      Modal.info({
      title: 'Next players turn',
      onOk() {board.handleOk()},
    })}, 500)

    
  }

  //When user clicks to next round
  handleOk(){
    if(this.state.previous == 'W'){
      this.setState({'player': 'B'})
    }else{
      this.setState({'player': 'W'})
    }
  }

  //When you click on square this method decides what should  happen
  handleClick(x, y){

    //If you are placing stones, then  
    if(this.state.phase === 0){
      const positionBounds = this.state.player === 'W' ? {'min' : 6, 'max' : 9} : {'min' : 0, 'max' : 3};
      if( x >= positionBounds.min && x <= positionBounds.max){
        let newGrid = this.state.grid;

        if(newGrid[x][y].player === undefined){
          newGrid[x][y] = this.state.player === 'W'  ? {'player' : 'W', 'piece': this.state.whitePieces.pop()} : {'player' : 'B', 'piece': this.state.blackPieces.pop()}
          this.setState({'grid': newGrid});
  
          if(this.state.whitePieces === undefined || this.state.whitePieces.length === 0){
            Modal.info({
              title: 'Second player is setting up his board',
              onOk() {},
            })
            this.setState({'player' : 'B'})
          }
          if(this.state.blackPieces === undefined || this.state.blackPieces.length === 0){
            Modal.info({
              title: 'Good luck with playing',
              onOk() {},
            })
            this.setState({'phase' : 1, 'player' : 'W'})
          }
        }
                  
      }
      
    }
    if(this.state.phase === 1){

      if(localStorage.getItem('from') === undefined ||localStorage.getItem('from') === "" ){
        if(!this.isMoveAble(x,y))
          return
        console.log('FROM')
        localStorage.setItem('from', JSON.stringify({'x' : x , 'y': y}) );
        this.setState({'selected': {x: x,y: y} })
      }else{
        console.log('TO')  
    
        let from = JSON.parse(localStorage.getItem('from'))
        if(this.isWater(x,y)){
          this.setState({'selected': {x: "A",y: "A"} })        
          return
        }
        if(x === from.x && y === from.y){
          localStorage.setItem('from', "" ) 
          this.setState({'selected': {x: "A",y: "A"} })        
          return;
        }

        this.movePiece({'x': from.x, 'y': from.y}, {'x': x, 'y': y})
        localStorage.setItem('from', "" ) 
        this.setState({'selected': {x: "A",y: "A"} })
        
      }
    }
  }

  
  getPiece(x,y){
    return this.state.grid[x][y]
  }

  //Pieces Flag - F and Bomb -B cannot be moved 
  isMoveAble(x,y){
    const pieceObj = this.getPiece(x,y)
    if(pieceObj !== undefined){
      if(pieceObj.player === this.state.player){
        if(!isNaN(pieceObj.piece) || pieceObj.piece === 'S'){
          return true;
        }
      }
    }
    return false;
  }

  isWater(x,y){
    return this.state.grid[x][y] === 'X'
  }

  //Checking if scout can move onto the selected field
  checkLine(from, to){
    let beginX = from.x;
    let beginY = from.y;
    let endX = to.x;
    let endY = to.y;
    let prev = undefined;
    
    if(beginX === endX){
      while(beginY !== endY){
        if(beginY > endY){
          beginY--
        }else{
          beginY++
        }
        if(this.state.grid[beginX][beginY] !== '+'){
          if(this.state.grid[beginX][beginY] === 'X'){
            return false
          }
          if(this.state.grid[beginX][beginY].player === this.state.grid[from.x][from.y].player){
            return false;
          }
          console.log("COLISION")
          console.log(this.state.grid[beginX][beginY])
            if(prev !== '+')
              return false          

        }
        prev = this.state.grid[beginX][beginY];
      }
    }else if(beginY === endY){
      while(beginX !== endX){
        if(beginX > endX){
          beginX--
        }else{
          beginX++
        }
        if(this.state.grid[beginX][beginY] !== '+'){
          if(this.state.grid[beginX][beginY] === 'X'){
            return false
          }
          if(this.state.grid[beginX][beginY].player === this.state.grid[from.x][from.y].player){
            return false;
          }

          console.log("COLISION")
          console.log(this.state.grid[beginX][beginY])
          if(prev !== '+')
            return false
        }
        prev = this.state.grid[beginX][beginY];
      }
    }else{
      return false
    }
    return true;
  }

  //The fight logic (When two different colored pieces colide on one square)
  fight(attacker, defender){
    let sound = document.createElement('audio')
    let defenderType = defender.piece;

    switch(defenderType){
      case 'F': 
        console.log('WIN')
        this.setState({'winner': attacker.player })
        return "WIN";
      case 'B':
        if(attacker.piece == '8')
          return 1;
        else
          sound.src = "../public/sounds/bomb.mp3"
          sound.play()
          return 0;
      default: 
        if(attacker.piece == defender.piece){
          return; 
        }
        if(attacker.piece == 'S'){
          if(defender.piece == '1')
            return 1;
          else
            return 0;
        }
        if(attacker.piece < defender.piece ){
          return 1;
        }else{
          return 0;
        }
    }
  }

  handlePlayerWon(){
    let board =this
    Modal.success({
      title: 'Congratulatins! You win',
      content: (
        <div>
          <p>If you have any ideas how to improve this game or spot any issue</p>
          <p>Please leave any comment <a href="https://github.com/sklenma/stratego-react/issues">here</a></p>
        </div>
      ),
      onOk() {board.handleReset()},
    });
  }

  movePiece(from, to){
    let newGrid = this.state.grid
    let source = newGrid[from.x][from.y];
    let target = newGrid[to.x][to.y];
    let xDistance = Math.abs(from.x - to.x)
    let yDistance = Math.abs(from.y - to.y)    
    let fightResult = "There's peace everywhere";
    
    this.setState({'target': {x: to.x, y: to.y}})
    var elem = document.querySelector('.selectedPiece > img');
    elem.style.transition = 'linear .2s'
    elem.style.transform = 'translate(100px, 0px)';

    if(source.piece === '9' && this.checkLine(from, to)){
      if(target != '+'){
        console.log("FIGHT")
        fightResult = this.fight(source, target)
      }else{
        newGrid[from.x][from.y] = "+";
        newGrid[to.x][to.y] = source
      }
      console.log("Valid move")
    } else if(xDistance <= 1 && yDistance <= 1 && (xDistance < 1 || yDistance < 1) ){
      if(source.player === target.player){
        return;
      }
      if(target != '+'){
        fightResult = this.fight(source, target)
      }else{
        newGrid[from.x][from.y] = "+";
        newGrid[to.x][to.y] = source
      }
      console.log("Valid move")
    }else{
      return;
    }
    switch (fightResult){
      case "There's peace everywhere":
        break;
      case "WIN":
        this.handlePlayerWon()
        return;
      case 1:
        newGrid[from.x][from.y] = "+";
        newGrid[to.x][to.y] = source
        break;
      case 0:
        newGrid[from.x][from.y] = "+";
        break;
      default:
        newGrid[from.x][from.y] = "+";
        newGrid[to.x][to.y] = "+";
    }
    this.setState({'grid': newGrid})
    this.handleMove();
  }


  render(){
    //define styles for the <table> element in the return() function below

    const g = this.state.grid;

    //loop through the squares in each row and generate a new Square component,
    //passing in props to the Square component in the nested map() function
    const board = g.map((row, i) => { return (
      <tr key={"row_"+i}>
        {row.map((col, j) => {
          //set the color of the square based on state.grid
          const color_ = g[i][j] === "X" ? 'blue': 'green'
          let icon_ = "";

          if(g[i][j].piece !== undefined){
            if(g[i][j].player === this.state.player || g[i][j].attacked){
              icon_ = g[i][j].piece;
            }else{
              icon_ = "U";
            }
          }

          
          //return Square component, passing in the following as props:
          //square color defined above in color_,
          //a value for the key which React needs (I think) and
          //a function to handle clicks with grid coordinates passed in as arguments
          return (
            <Square 
              handleClick={()=>this.handleClick(i,j)} 
              color={color_} 
              icon={icon_}
              selected = {(i == this.state.selected.x && j == this.state.selected.y)} 
              target = {this.state.target}
              player={g[i][j].player} 
              key={i+"_"+j} 
            />
              )
            }
          )
        }
      </tr>)
    });

    //returns the board with the Square Components in {board},
    //as well as a simple Button component that takes the handleReset function as a prop
    //this could be further refactored to separate the layout and styling, but it isn't that complicated so I will leave it like this
    return (
      <div>
        <div style={{ textAlign:'center'}}>
          <h2><a href="https://en.wikipedia.org/wiki/Stratego" style={{textDecoration:"none"}}>Stratego</a></h2>
      <Menu
        onClick={this.handleMenuClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
      >
        <Menu.Item key="generate">
          <Icon type="forward" />Fill the board automatically
        </Menu.Item>
        <Menu.Item key="restart">
          <Icon type="retweet" /> Restart game
        </Menu.Item>
        <Menu.Item key="link-github">
          <a href="https://github.com/sklenma/stratego-react" target="_blank" rel="noopener noreferrer"><Icon type="github" /> See source on GitHub</a>
        </Menu.Item>
      </Menu>

          <div>
            <table cellSpacing="0" className="game-board">
              <tbody>
                {board}
              </tbody>
            </table>
          </div>
          <br />
        
        </div>
      </div>

    )
  } 
}
