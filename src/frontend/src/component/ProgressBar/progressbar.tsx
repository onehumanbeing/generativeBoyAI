import React from 'react';
import './progressbar.css'; // Make sure to create this CSS file

interface ProgressBarProps {
  value: number; 
  max: number;  
  leftText: string;
  rightText: string;
  topLeftText: string;
  topRightText: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, leftText, rightText, topLeftText, topRightText}) => {
  return (
    <div className="progress-bar-container">
      {/* <div className="label">{label}</div> */}
      {/* <div className="progress-text">
      <span className="top-left-text">{topLeftText}</span>
       <span className="top-right-text">{topRightText}</span>
       </div> */}
      <progress value={value} max={max} />
      <div className="progress-text">
        <span className="left-text">{leftText}</span>
        <span className="right-text">{rightText}</span>
      </div>
    </div>

  );
};

export default ProgressBar;