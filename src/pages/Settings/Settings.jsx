import React, { useState } from "react";
import "./Settings.css";

const Settings = () => {
  const [clinicName, setClinicName] = useState("Smart Clinic Manager");
  const [address, setAddress] = useState("123 Main Street,Kundrathur,Chennai, India");
  const [businessHours, setBusinessHours] = useState({
    Monday: "9:00 AM - 5:00 PM",
    Tuesday: "9:00 AM - 5:00 PM",
    Wednesday: "9:00 AM - 5:00 PM",
    Thursday: "9:00 AM - 5:00 PM",
    Friday: "9:00 AM - 5:00 PM",
    Saturday: "10:00 AM - 2:00 PM",
    Sunday: "Closed",
  });
  const [notifications, setNotifications] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusinessHours({
      ...businessHours,
      [name]: value,
    });
  };

  const handleClinicNameChange = (e) => {
    setClinicName(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleNotificationsChange = () => {
    setNotifications(!notifications);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Settings updated successfully!");
  };

  return (
    <div className="settings-container">
      <h2 className="settings-header">Clinic Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="section">
          <h3>Clinic Information</h3>
          <div className="form-group">
            <label htmlFor="clinicName">Clinic Name</label>
            <input
              type="text"
              id="clinicName"
              value={clinicName}
              onChange={handleClinicNameChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={handleAddressChange}
              required
            />
          </div>
        </div>

        <div className="section">
          <h3>Business Hours</h3>
          {Object.keys(businessHours).map((day) => (
            <div key={day} className="form-group business-hours">
              <label htmlFor={day}>{day}</label>
              <input
                type="text"
                id={day}
                name={day}
                value={businessHours[day]}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}
        </div>

        <div className="section">
          <h3>Preferences</h3>
          <div className="form-group notifications">
            <label htmlFor="notifications">Notifications</label>
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="notifications"
                checked={notifications}
                onChange={handleNotificationsChange}
              />
              <label htmlFor="notifications" className="switch"></label>
            </div>
          </div>
        </div>

        <button type="submit" className="save-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Settings;
