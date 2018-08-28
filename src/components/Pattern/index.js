import Pattern from "./Pattern";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { patternKeyAction, patternError, patternRegister} from './../../actions/patternKeyAction';


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

export default connect(mapStateToProps, mapDispatchToProps)(Pattern);
