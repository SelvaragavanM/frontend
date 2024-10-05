import React from "react";
import "./NotificationPopup.css";

const NotificationPopup = ({ notifications, onClose }) => {
  return (
    <div className="notification-popup show">
      <button className="notification-popup-close" onClick={onClose}>
        ×
      </button>
      <ul className="notification-list">
        {notifications.map((notification, index) => (
          <li key={index} className="notification-item">
            {notification}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPopup;
