import { connect } from 'react-redux';
import { patternKeyAction, patternError, patternRegister} from './../../actions/patternKeyAction';
import { bindActionCreators } from 'redux';
import Validate from './validate'

const mapStateToProps = (state) => {

  return {
		patternKey: state.patternkeyReducer.patternkey,
		isRegistered: state.patternkeyReducer.isRegistered
  };

};
const mapDispatchToProps = (dispatch) => {

  return bindActionCreators({
		patternKeyAction,
		patternError,
		patternRegister
  }, dispatch);

};
export default connect(mapStateToProps, mapDispatchToProps)(Validate);
