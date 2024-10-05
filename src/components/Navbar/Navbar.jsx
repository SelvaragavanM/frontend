import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import {
  FaBell,
  FaUserCircle,
  FaQuestionCircle,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaRobot,
} from "react-icons/fa";
import logo from "../../assets/logo.png";
import LoginPopup from "../LoginPopup/LoginPopup";
import NotificationPopup from "../NotificationPopup/NotificationPopup";
import { checkUserAuth } from "../../components/auth";

const Navbar = ({ isSidebarOpen, toggleTheme, isDarkMode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await checkUserAuth();
        setIsLoggedIn(authenticated);
      } catch (error) {
        console.error("Error checking authentication status:", error);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  const notifications = [
    "Your appointment is confirmed for Sep 30, 2024.",
    "New message from Dr. Aarav Patel",
    "Reminder: Follow-up appointment on Sep 27, 2024.",
  ];

  return (
    <nav
      className={`navbar ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"} ${
        isDarkMode ? "dark-mode" : ""
      }`}
    >
      <div className="navbar-logo">
        <img src={logo} alt="Clinic Logo" />
        <h2>SmartClinic Management</h2>
      </div>
      <div className="navbar-actions">
        <Link to="/ai-assistant" className="icon-button">
          <FaRobot />
        </Link>
        <div className="notification-container">
          <button className="icon-button" onClick={handleBellClick}>
            <FaBell />
            <span className="notification-badge">3</span>
          </button>
          {showNotifications && (
            <NotificationPopup
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>
        <Link to="/help" className="icon-button">
          <FaQuestionCircle />
        </Link>
        {isLoggedIn ? (
          <>
            <Link to="/patient-portal" className="icon-button">
              <FaUserCircle />
            </Link>
            <button className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <button className="login-button" onClick={handleLoginClick}>
            Login
          </button>
        )}
        <select className="language-selector">
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="ta">தமிழ்</option>
        </select>
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
      {showLogin && (
        <LoginPopup
          setShowLogin={setShowLogin}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </nav>
  );
};

export default Navbar;
