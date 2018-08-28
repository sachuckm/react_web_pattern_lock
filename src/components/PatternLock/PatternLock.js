import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import LockPoint from "./../LockPoint/LockPoint"
import { connect } from 'react-redux';
import { patternError } from './../../actions/patternKeyAction';
import { bindActionCreators } from 'redux';


const getDistance = (p1, p2) => Math.sqrt(((p2.x - p1.x) ** 2) + ((p2.y - p1.y) ** 2));
const getAngle    = (p1, p2) => Math.atan2(p2.y - p1.y, p2.x - p1.x);
const errorColor = "#F00";
const connectorWidth = 4;
const connectorColor = "#FFF";
const disabledColor = "#BBB";

class PatternLock extends PureComponent {
	static displayName = "PatternLock";
	static propType = {
		width : PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		onChange : PropTypes.func,
		pointColor      : PropTypes.string,
		pointSize       : PropTypes.number,
		pointActiveSize : PropTypes.number,
		error: PropTypes.bool,
		patternError: PropTypes.func,
		size(props, name) {
			if (props[name] < 2 || props[name] > 9) return new Error("Size must be between 2 and 9");
		}
	}
	static defaultProps = {
		size : 3,
		pointSize       : 10,
		pointColor      : "#FFF",
		pointActiveSize : 30,
	};

	static getPositionFromEvent({ clientX, clientY, touches }) {
		if (touches && touches.length) return { x : touches[0].clientX, y : touches[0].clientY };
		return { x : clientX, y : clientY };
	}

	constructor(props) {
		super();

		this.points  = [];

		for (let i = (props.size ** 2) - 1; i >= 0; i -= 1) this.points.push({ x : 0, y : 0 });

		this.state = {
			height    : 0,
			path      : [],
			position  : { x : 0, y : 0 },
			error     : false,
			isLoading : false
		};

		this.unerrorTimeout = 0;

		this.onHold    = this.onHold.bind(this);
		this.onRelease = this.onRelease.bind(this);
		this.onMove    = this.onMove.bind(this);

		this.left = 0;
		this.top  = 0;
	}

	componentDidMount() {
		this.updateHeight();
		window.addEventListener("mouseup", this.onRelease);
		window.addEventListener("touchend", this.onRelease);
	}

	componentWillUnmount() {
		clearTimeout(this.unerrorTimeout);
		window.removeEventListener("mouseup", this.onRelease);
		window.removeEventListener("touchend", this.onRelease);
	}

	onHold(evt) {
            if (!this.isDisabled) {
			console.log('###############this.props####'+JSON.stringify(this.props));
            this.props.patternError(false);
            this.updateProperties();
			this.wrapper.addEventListener("mousemove", this.onMove);
			this.wrapper.addEventListener("touchmove", this.onMove);
			this.reset();
			this.updateMousePositionAndCheckCollision(evt, true);
		}
	}

	onRelease(evt) {
		this.wrapper.removeEventListener("mousemove", this.onMove);
		this.wrapper.removeEventListener("touchmove", this.onMove);

		if (!this.isDisabled && this.state.path.length > 0 && !this.props.error) {
			this.setState({ isLoading : true });

            const validate = this.props.onChange(this.state.path);
			if (typeof validate.then !== "function") throw new Error("The onChnage prop must return a promise.");
			validate.then(() => {
				this.reset();
				this.setState({ isLoading : false });
			}).catch((err) => {
				this.error(err);
				this.setState({ isLoading : false });
			});
		}
	}

	onMove(evt) {
		this.updateMousePositionAndCheckCollision(evt);
	}

	get isDisabled() {
		return this.state.isLoading;
	}  
	getExactPointPosition({ x, y }) {
		const halfActiveSize     = Math.floor(this.props.pointActiveSize / 2);
		const halfConnectorWidth = Math.floor(connectorWidth / 2);
		return {
			x : x + halfActiveSize,
			y : (y + halfActiveSize) - halfConnectorWidth
		};
	}

	getColor(defaultColor, isActive = true) {
		if (this.props.error && isActive) return errorColor;
		//if (this.isDisabled) return disabledColor;
		return defaultColor;
	}


	updateMousePositionAndCheckCollision(evt, reset) {
		const { x, y } = PatternLock.getPositionFromEvent(evt);
		const position = { x : x - this.left, y : y - this.top };

		this.setState({
			path : reset ? [] : this.state.path,
			position
		}, this.detectCollision.bind(this, position));
	}

	activate(i) {
		if (this.state.path.indexOf(i) === -1) {
			const jumpingPoints = this.checkJumping(this.state.path[this.state.path.length - 1], i);
			this.setState({ path : [...this.state.path, ...jumpingPoints, i] });
		}
	}

	detectCollision({ x, y }) {
		const { pointActiveSize } = this.props;

		this.points.forEach((point, i) => {
			if (this.state.path.indexOf(i) === -1) {
				if (
					x > point.x
					&& x < point.x + pointActiveSize
					&& y > point.y
					&& y < point.y + pointActiveSize
				) {
					this.activate(i);
				}
			}
		});
	}

	checkJumping(prev, next) {
		const { size } = this.props;
		const { path } = this.state;

		const x1 = prev % size;
		const y1 = Math.floor(prev / size);

		const x2 = next % size;
		const y2 = Math.floor(next / size);

		if (y1 === y2) { // Horizontal
			const xDifference = Math.abs(x1 - x2);
			if (xDifference > 1) {
				const points = [];
				const min = Math.min(x1, x2);
				for (let i = 1; i < xDifference; i += 1) {
					const point = (y1 * size) + i + min;
					if (path.indexOf(point) === -1) points.push(point);
				}
				return points;
			}
		} else if (x1 === x2) { // Vertical
			const yDifference = Math.abs(y1 - y2);
			if (yDifference > 1) {
				const points = [];
				const min = Math.min(y1, y2);
				for (let i = 1; i < yDifference; i += 1) {
					const point = ((i + min) * size) + x1;
					if (path.indexOf(point) === -1) points.push(point);
				}
				return points;
			}
		} else { // Diagonal
			const xDifference = Math.abs(x1 - x2);
			const yDifference = Math.abs(y1 - y2);
			if (xDifference === yDifference && xDifference > 1) {
				const dirX = x2 - x1 > 0 ? 1 : -1;
				const dirY = y2 - y1 > 0 ? 1 : -1;
				const points = [];
				for (let i = 1; i < yDifference; i += 1) {
					const point = (((i * dirY) + y1) * size) + (i * dirX) + x1;
					if (path.indexOf(point) === -1) points.push(point);
				}
				return points;
			}
		}
		return [];
	}

	updateHeight() {
		const height = this.wrapper.offsetWidth;
		this.setState({ height }, this.updateProperties);
	}

	updateProperties() {
		const halfSize        = this.props.pointActiveSize / 2;
		const { left, top }   = this.wrapper.getBoundingClientRect();
		const { size }        = this.props;
		const sizePerItem     = this.state.height / this.props.size;
		const halfSizePerItem = sizePerItem / 2;

		this.left = left;
		this.top  = top;

		this.points = this.points.map((x, i) => ({
			x : ((sizePerItem * (i % size)) + halfSizePerItem) - halfSize,
			y : ((sizePerItem * Math.floor(i / size)) + halfSizePerItem) - halfSize
		}));
	}


	error() {
		this.setState({ error : true });
		this.unerrorTimeout = setTimeout(() => { this.reset(); }, 3000);
	}

	reset() {
		clearTimeout(this.unerrorTimeout);
		this.setState({
			error : false,
			path  : []
		});
	}

	renderConnectors() {
		return (
			<div className="react-pattern-lock__connector-wrapper">
				{
					this.state.path.map((x, i, arr) => {
						const toMouse = arr[i + 1] === undefined;
						if (toMouse && (this.isDisabled || this.props.error)) return null;

						const fr = this.getExactPointPosition(this.points[x]);
						let to = null;
						if (toMouse) {
							to = {
								x : this.state.position.x,
								y : this.state.position.y - (connectorWidth / 2)
							};
						} else {
							to = this.getExactPointPosition(this.points[arr[i + 1]]);
						}
						return (
							<div className="react-pattern-lock__connector"
								key={`${x}-${arr[i + 1]}`}
								style={{
									background : this.getColor(connectorColor),
									transform  : `rotate(${getAngle(fr, to)}rad)`,
									width      : `${getDistance(fr, to)}px`,
									left       : `${fr.x}px`,
									top        : `${fr.y}px`,
									height     : connectorWidth
								}}
                            />
						);
					})
				}
			</div>
		);
	}

	renderPoints() {
		const {
			pointSize,
			pointActiveSize,
			pointColor,
			size
		} = this.props;

		return this.points.map((x, i) => {
			const isActive = this.state.path.indexOf(i) > -1;
			const percentPerItem = 100 / size;

			return (
                    <LockPoint
                    pointActiveSize = {pointActiveSize}
                    percentPerItem = {percentPerItem}
                    pointSize = {pointSize}
                    isActive = {isActive}
                    getColor = {this.getColor(pointColor, isActive)}
                    key = {i}/>
			);
		});
	}

	render() {
		return (
			<div
				ref={ (elem) => { this.wrapper = elem; } }
				className={`react-pattern-lock__pattern-wrapper${this.props.error ? " error" : ""}${this.isDisabled ? " disabled" : ""}` }
				style={{ ...this.props.style, left:"750px", width : this.props.width, height : this.state.height }}
				onMouseDown={ this.onHold }
				onTouchStart={ this.onHold }
				role="presentation"
			>
				{ this.renderConnectors() }
				{ this.renderPoints() }
			</div>
		);
	}
}
PatternLock.propType = {
	width : PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	onChange : PropTypes.func,
	pointColor      : PropTypes.string,
	pointSize       : PropTypes.number,
	pointActiveSize : PropTypes.number,
	error: PropTypes.bool,
	patternError: PropTypes.func,
	size(props, name) {
		if (props[name] < 2 || props[name] > 9) return new Error("Size must be between 2 and 9");
	}
};
export default PatternLock;