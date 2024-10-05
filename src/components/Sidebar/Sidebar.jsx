import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import {
  FaChartLine,
  FaUserInjured,
  FaCalendarAlt,
  FaUserMd,
  FaPrescription,
  FaVial,
  FaMoneyBillAlt,
  FaFileAlt,
  FaBoxes,
  FaCog,
  FaBars,
  FaVideo,
} from "react-icons/fa";

const Sidebar = ({ onToggle, selectedPanel }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
    onToggle(!isOpen);
  };

  const routes = {
    Patient: [
      { path: "/appointments", icon: <FaCalendarAlt />, label: "Appointments" },
      { path: "/doctors", icon: <FaUserMd />, label: "Doctors" },
      {
        path: "/prescriptions",
        icon: <FaPrescription />,
        label: "Prescriptions",
      },
      { path: "/medical-tests", icon: <FaVial />, label: "Medical Tests" },
      { path: "/telemedicine", icon: <FaVideo />, label: "Telemedicine" },
      { path: "/settings", icon: <FaCog />, label: "Settings" },
    ],
    Doctor: [
      { path: "/", icon: <FaChartLine />, label: "Dashboard" },
      { path: "/patients", icon: <FaUserInjured />, label: "Patients" },
      {
        path: "/prescriptions",
        icon: <FaPrescription />,
        label: "Prescriptions",
      },
      { path: "/medical-tests", icon: <FaVial />, label: "Medical Tests" },
      { path: "/billing", icon: <FaMoneyBillAlt />, label: "Billing" },
      { path: "/reports", icon: <FaFileAlt />, label: "Records" },
      { path: "/inventory", icon: <FaBoxes />, label: "Inventory" },
      { path: "/telemedicine", icon: <FaVideo />, label: "Telemedicine" },
      { path: "/settings", icon: <FaCog />, label: "Settings" },
    ],
    Admin: [
      { path: "/", icon: <FaChartLine />, label: "Dashboard" },
      { path: "/patients", icon: <FaUserInjured />, label: "Patients" },
      { path: "/appointments", icon: <FaCalendarAlt />, label: "Appointments" },
      { path: "/doctors", icon: <FaUserMd />, label: "Doctors" },
      {
        path: "/prescriptions",
        icon: <FaPrescription />,
        label: "Prescriptions",
      },
      { path: "/medical-tests", icon: <FaVial />, label: "Medical Tests" },
      { path: "/billing", icon: <FaMoneyBillAlt />, label: "Billing" },
      { path: "/reports", icon: <FaFileAlt />, label: "Records" },
      { path: "/inventory", icon: <FaBoxes />, label: "Inventory" },
      { path: "/telemedicine", icon: <FaVideo />, label: "Telemedicine" },
      { path: "/settings", icon: <FaCog />, label: "Settings" },
    ],
  };

  const renderLinks = () => {
    const panelRoutes = routes[selectedPanel] || routes["Admin"];
    return panelRoutes.map(({ path, icon, label }) => (
      <li key={path}>
        <Link to={path}>
          {icon} <span>{label}</span>
        </Link>
      </li>
    ));
  };

  return (
    <div className={`sidebar ${isOpen ? "" : "closed"}`}>
      <button className="menu-button" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <ul className="sidebar-links">{renderLinks()}</ul>
    </div>
  );
};

export default Sidebar;
