import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './App.css';
import { patternKeyAction } from './actions/patternKeyAction';
import Pattern from "./components/Pattern"


class App extends Component {
  
  render() {
    return (
      <div className="App">
        <Pattern></Pattern>
      </div>
    );
  }
}

const mapStateToProps = (state) => {

  return {
    patternKey: state.patternkeyReducer.patternKey,
  };

};
const mapDispatchToProps = (dispatch) => {

  return bindActionCreators({
    patternKeyAction
  }, dispatch);

};
export default connect(mapStateToProps, mapDispatchToProps)(App);
