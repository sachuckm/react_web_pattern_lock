import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PatternLock from "./../PatternLock";

class Validate extends Component {

	state = {
        isValidated : false,
        validateScreen: true,
	};

	onChangeEvent = (pattern) => {
					return new Promise((resolve, reject) => {
					if (this.props.patternKey !== pattern.toString().replace (/,/g, "")) {
						this.props.patternError(true);
						reject();
					} else {
						this.setState({isValidated: true})
						resolve();
					}
				});
	}
	render() {
	const patternLockValidator = !this.state.isValidated && this.props.isRegistered ? (
		<React.Fragment>
          <h1>VALIDATE PATTERN</h1>
          <PatternLock className = "pattern"
            width={400}
            pointSize={15}
            pointActiveSize={80}
			size={3}
			onChange = {this.onChangeEvent.bind(this)}
          />
        </React.Fragment>
	):<h1>SUCCESSFULLY VALIDATED</h1>;
	  return(
	    <div >
			{patternLockValidator}
	    </div>
	  );
	}
}

Validate.propTypes = {
    patternKeyAction: PropTypes.func,
    patternKey: PropTypes.string,
};
export default Validate;
