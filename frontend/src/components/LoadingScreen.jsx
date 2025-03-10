import React from "react";

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="loading-container">
      <div className="pl">
        <div className="pl__sr">Loading...</div>
      </div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default LoadingScreen;
