import React from 'react';
import PropTypes from 'prop-types';
import "./pattern_converted.css";

const LockPoint = ({  pointActiveSize, percentPerItem, pointSize, isActive , getColor, key }) => {
  return (
    		<div 
				key={ key }
				className="react-pattern-lock__point-wrapper"
				style={{
					width  : `${percentPerItem}%`,
					height : `${percentPerItem}%`,
					flex   : `1 0 ${percentPerItem}%`
				}}
			>
			<div
				className="react-pattern-lock__point"
				style={{
					width  : pointActiveSize,
					height : pointActiveSize
					}}
				>
			<div
				className={ isActive  ? "active" : "" }
				style={{
					width      : pointSize,
					height     : pointSize,
                    background : getColor,
				}}
			/>
			</div>
			</div>
		);
};

LockPoint.propTypes = {
    pointActiveSize:PropTypes.String,
    percentPerItem:PropTypes.String,
    pointSize:PropTypes.String,
    isActive:PropTypes.String,
    getColor:PropTypes.String,
	key:PropTypes.Number,
	//transform: PropTypes.String
};

export default LockPoint;
