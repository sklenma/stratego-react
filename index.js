import React from 'react';
import ReactDOM from 'react-dom';
import Board from './src/Board'
import { LocaleProvider, DatePicker, message } from 'antd';


class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Board/>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));