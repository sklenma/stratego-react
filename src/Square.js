import React from 'react';
import './square.css';




export class Square extends React.Component{

  render(){
    const color_ = this.props.color;
    const icon_ = this.props.icon;
    const player_ = this.props.player;  
  
    return (
            <td
              className ={this.props.selected ? "selectedPiece": " "}
              style={{
                backgroundColor: color_
              }}
              onClick={this.props.handleClick} >
                {icon_ === "" ? "" : 
                    <img src={"../public/pieces/"+ icon_ +".colors-black-blue-red.svg"}
                        style={{ 
                        background: player_ === 'W' ? '#428bca' : '#d43f3a',                     
                          }}
                    />
                }       
            </td>         
    )
  }
}
