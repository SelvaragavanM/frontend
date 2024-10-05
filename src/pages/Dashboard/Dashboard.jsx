import React, { useState } from "react";
import "./Dashboard.css";
import {
  FaUserInjured,
  FaCalendarAlt,
  FaClock,
  FaChartLine,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

const Dashboard = ({
  patientsCount,
  appointmentsCount,
  upcomingAppointments,
}) => {
  const [modalData, setModalData] = useState(null);

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Appointments",
        data: [30, 45, 60, 70, 80, 90, 110],
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        fill: true,
      },
      {
        label: "Revenue",
        data: [5000, 6000, 7000, 8000, 9000, 10000, 12000],
        borderColor: "#2ecc71",
        backgroundColor: "rgba(46, 204, 113, 0.2)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            }).format(value);
          },
        },
      },
    },
  };

  const cardData = [
    {
      icon: <FaUserInjured />,
      title: "Patients",
      value: patientsCount,
      onClick: () =>
        setModalData({
          title: "Patient Status",
          data: [
            "Snjeev  - Pending Appointment (10:00 AM)",
            "Madhan - Pending Appointment (11:00 AM)",
            "Karthik  - Completed Appointment (02:00 PM)",
            "Venkat - Completed Appointment (03:00 PM)",
            "Snju - Delayed Appointment (04:00 PM)",
          ],
        }),
    },
    {
      icon: <FaCalendarAlt />,
      title: "Appointments",
      value: appointmentsCount,
      onClick: () =>
        setModalData({
          title: "Appointment Status",
          data: [
            "Snjeev  - Completed (10:00 AM)",
            "Venkat - Completed (11:00 AM)",
            "Sundar - Pending (04:00 PM)",
            "Madhan - Delayed (06:00 PM)",
          ],
        }),
    },
    { icon: <FaClock />, title: "Timing", value: "09 AM - 05 PM" },
    { icon: <FaChartLine />, title: "Performance", value: "+8%" },
  ];

  const handleCloseModal = () => {
    setModalData(null);
  };

  return (
    <div className="dashboard">
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Welcome, Sanjeev</h1>
          <p>Here's an overview of your clinic's performance</p>
        </header>
        <div className="dashboard-cards">
          {cardData.map((card, index) => (
            <div key={index} className="card" onClick={card.onClick}>
              <div className="card-icon">{card.icon}</div>
              <div className="card-info">
                <h2>{card.title}</h2>
                <p>{card.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="dashboard-charts">
          <h2>Monthly Performance</h2>
          <Line data={data} options={chartOptions} />
        </div>
        <div className="dashboard-recent-activities">
          <h2>Recent Activities</h2>
          <ul>
            <li>Patient John Durairaj had a follow-up appointment.</li>
            <li>New prescription created for patient Alice Johnson.</li>
            <li>Revenue report generated for the month of July.</li>
          </ul>
        </div>
      </main>
      {modalData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{modalData.title}</h2>
            <ul>
              {modalData.data.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button className="modal-close" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
