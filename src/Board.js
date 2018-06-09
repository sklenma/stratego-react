import React from 'react';
import { Square } from './Square';

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
      //"+"" represenets an empty square, "b" is a black stone and "w" is a white stone
      'grid':this.newBoard(),

    };
    //bind this word to helper functions
    // this.handleClick = this.handleClick.bind(this);
    // this.handleReset = this.handleReset.bind(this);
  }

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

  newBoard(){
    var arr = Array(10).fill().map(x => Array(10).fill("+"));
    arr[4][2] = arr[4][3] = arr[5][2] = arr[5][3] = "X";
    arr[4][6] = arr[4][7] = arr[5][6] = arr[5][7] = "X";

    return arr;
  }

  // //generate a new empty grid and set it to the grid state with setState
  handleReset(){
    //TODO Button
    this.setState({'phase':0 , 'grid':this.newBoard()});
  }

  playerSetup(isWhite){
    if(isWhite){



    }
  }

  handleClick(x, y){
    console.log(x,y);
    if(this.state.phase === 0){
      const positionBounds = this.state.player === 'W' ? {'min' : 6, 'max' : 9} : {'min' : 0, 'max' : 3};
      if( x >= positionBounds.min && x <= positionBounds.max){
        let newGrid = this.state.grid;
        console.log(newGrid[x][y].player);

        if(newGrid[x][y].player === undefined){
          newGrid[x][y] = this.state.player === 'W'  ? {'player' : 'W', 'piece': this.state.whitePieces.pop()} : {'player' : 'B', 'piece': this.state.blackPieces.pop()}
          this.setState({'grid': newGrid});
          console.log(this.state.grid[x][y])
  
          if(this.state.whitePieces === undefined || this.state.whitePieces.length === 0){
            this.setState({'player' : 'B'})
          }
        }
                  
      }
      
    }
  }

  
  //   //only add a peice and check for wins if the clicked square is empty
  //   if (this.state.grid[x][y] === '+'){
  //     //we don't want to mutate state directly, so we store the reference to 'grid' in a const
  //     const g = this.state.grid;
  //     //set the grid square cooresponding to the clicked square to the color of the current player
  //     g[x][y] = this.state.isWhite === true ? 'w':'b';
  //     //set the state with the new grid data
  //     this.setState({'grid':g, 'isWhite':!this.state.isWhite})

  //     //helper function for
  //     function checkDir(x_, y_, color){
  //       //track how many squares of a given color there are in a given dirention (specified by x_ and y_)
  //       //for example checkDir(0,1, 'w') checks how many white stones there are in a row to the right )
  //       let tracked = 0;
  //       let _x = x;
  //       let _y = y;
  //       //stop tracking stones when the color is not equal to the specified stone or we have gone past the edge of the board
  //       while (g[_x] !== undefined && g[_x][_y] === color){
  //         //increment the number of tracked stones
  //         tracked += 1;
  //         //increment/decrement to check the next square in the specified direction
  //         _y += y_;
  //         _x += x_;
  //       }
  //       return tracked;
  //     }
  //     //sum the directions (left+right, up+down, 2 diagonals)
  //     const w_horizontal = checkDir(0, 1, 'w') + checkDir(0, -1, 'w') -1;
  //     const b_horizontal = checkDir(0, 1, 'b') + checkDir(0, -1, 'b') -1;

  //     const w_vertical = checkDir(1, 0, 'w') + checkDir(-1, 0, 'w') -1;
  //     const b_vertical = checkDir(1, 0, 'b') + checkDir(-1, 0, 'b') -1;

  //     const w_diag1 = checkDir(1, 1, 'w') + checkDir(-1, -1, 'w') -1;
  //     const b_diag1 = checkDir(1, 1, 'b') + checkDir(-1, -1, 'b') -1;

  //     const w_diag2 = checkDir(1, 1, 'w') + checkDir(-1, -1, 'w') -1;
  //     const b_diag2 = checkDir(-1, 1, 'b') + checkDir(1, -1, 'b') -1;

  //     //check to see if there are any sums greater than or equal to 5 and alert the players of a win
  //     //setTimeout is called so that the alert() function does not hold up the rendering of the board.
  //     if (w_horizontal >=  5 || w_vertical >=  5 || w_diag1 >=  5 || w_diag2 >=  5){
  //       setTimeout(()=>{alert('white wins')}, 1);
  //     }

  //     if (b_horizontal >= 5 || b_vertical >= 5 || b_diag1 >= 5 || b_diag2 >= 5){
  //       setTimeout(()=>{alert('black wins')}, 1);
  //     }
  //   }
  // }
  render(){
    //define styles for the <table> element in the return() function below
    const style={
             textAlign: "center",
             margin:"auto",
             width:"600px",
             height: "600px",
             border:".5px solid #ccc",
             tableLayout:'fixed',
           };
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
            if(g[i][j].player === this.state.player){
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
            <Square handleClick={()=>this.handleClick(i,j)} color={color_} icon={icon_} key={i+"_"+j} />
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
      <div style={{ textAlign:'center'}}>
      <h2><a href="https://en.wikipedia.org/wiki/Stratego" style={{textDecoration:"none"}}>Stratego</a></h2>
      <div>
      <table cellSpacing="0" style={style}>
        <tbody>
          {board}
        </tbody>
      </table>
      </div>
      <br />
      </div>
    )
  } 
}
