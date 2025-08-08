import React from 'react';
import './Notification.css';

const Notification = ({ message, type = 'info', onClose }) => {
  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-content">
        <span className="notification-message">{message}</span>
        {onClose && (
          <button className="notification-close" onClick={onClose}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;