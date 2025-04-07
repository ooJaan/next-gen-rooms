import React from 'react';
import '../css/Loading.css';

const Loading = ({ size = '50px', thickness = '5px' }) => {
  return (
    <div className="loading-container">
      <div 
        className="loading-spinner" 
        style={{ 
          width: size, 
          height: size,
          borderWidth: thickness
        }}
      ></div>
    </div>
  );
};

export default Loading;