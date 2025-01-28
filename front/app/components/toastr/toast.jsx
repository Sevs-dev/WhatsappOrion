import React from "react";
import './toast.css';
const Toast = ({ type, message }) => {
  return (
    <div className="container">
      <div className={`notification notification--${type}`}>
        <div className="notification-body">
          <div className={`notification-icon notification-icon--${type}`}></div>
          {message}
        </div>
        <div className="notification-progress"></div>
      </div>
    </div>
  );
};
 
export default Toast;