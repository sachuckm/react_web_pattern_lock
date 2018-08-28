

import { connect } from 'react-redux';
import { patternError } from './../../actions/patternKeyAction';
import { bindActionCreators } from 'redux';
import PatternLock from './PatternLock'



const mapStateToProps = (state) => {
    return {
      patternKey: state.patternkeyReducer.patternkey,
      error:state.patternkeyReducer.error
    };
  };
  const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
          patternError
    }, dispatch);
  };


export default connect(mapStateToProps, mapDispatchToProps)(PatternLock);
