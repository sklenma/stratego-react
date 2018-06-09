import React from 'react';

export class Square extends React.Component{
  render(){
    const color_ = this.props.color;
    const icon_ = this.props.icon;
    return (
      <td
        style={{
          overflow:'hidden',
          width:'10%',
          height:'10%',
          backgroundColor: color_,
          color:'red',
          borderColor: 'black',
          border:".5px solid black"
        }}
      onClick={this.props.handleClick} >
        {icon_ === "" ? "" : 
            <img src={"../pieces/"+ icon_ +".colors-black-blue-red.svg"}
                style={{width: '40px', height: '40px'}}
            />
        }     
      </td>
    )
  }
}
