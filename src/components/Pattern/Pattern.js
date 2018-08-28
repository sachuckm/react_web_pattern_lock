import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PatternLock from "./../PatternLock";
import Validate from './../Validate'

class Pattern extends Component {

	state = {
		header:'',
		pattern: '',
	};
	onChangeEvent = (key) => {
		this.setState({ isLoading: true });
	this.setState({ isLoading: true });
	const pattern = key.toString().replace (/,/g, "");
	return new Promise((resolve, reject) => {
		if (pattern === this.state.pattern) {
			this.props.patternKeyAction(pattern);
			this.props.patternRegister(true);
			alert("Successfully registered ")
				resolve();
		} else {
			this.props.patternError(true);
			reject();
		}
	});
	}
	onchangeConfirm(pattern) {
		return new Promise((resolve, reject) => {
      if (pattern.length < 3) {
        reject();
      } else {
			this.setState({reset:true})
			this.setState({pattern: pattern.toString().replace (/,/g, "")})
			this.setState({header : 'CONFIRM PATTERN'});
    	resolve();
      }
    });
	}
	componentDidMount() {
	this.setState({header : "SELECT PATTERN FOR REGISTER"})
	}
	render() {
		if (!this.props.isRegistered) {
			if(this.state.pattern.length) {
				return (
					<React.Fragment>
						<h1 className ="header">{this.state.header}</h1>
          		<PatternLock className = "pattern"
            	width={400}
            	pointSize={15}
            	pointActiveSize={80}
							size={3}
							onChange = {this.onChangeEvent.bind(this)}
          	/>
				</React.Fragment>) 
				} else {
				return (
					<React.Fragment>
						<h1 className ="header">{this.state.header}</h1>
							<PatternLock className = "pattern"
								width={400}
								pointSize={15}
								pointActiveSize={80}
								size={3}
								onChange = {this.onchangeConfirm.bind(this)}
							/>
					</React.Fragment>)
			}
		} else {
			return <Validate />
		}
	}
}

Pattern.propTypes = {
    patternKeyAction: PropTypes.func,
		patternKey: PropTypes.string,
		patternError: PropTypes.func,
		isRegistered: PropTypes.bool
};
export default Pattern;
