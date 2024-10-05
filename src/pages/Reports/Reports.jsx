import React, { useState } from "react";
import "./Reports.css";
import {
  FaUser,
  FaCalendarAlt,
  FaHeartbeat,
  FaNotesMedical,
} from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const initialRecords = [
  {
    id: 1,
    name: "Aarav",
    dob: "1988-03-15",
    visits: 10,
    medicalHistory: "Type 2 Diabetes, Hypertension",
    nextAppointment: "2024-10-05",
    prescriptions: "Metformin, Lisinopril",
    trends: [5, 6, 4, 5, 7, 6, 8, 7, 6, 5, 4, 5],
  },
  {
    id: 2,
    name: "Priya ",
    dob: "1992-11-22",
    visits: 7,
    medicalHistory: "Asthma, Allergic Rhinitis",
    nextAppointment: "2024-09-18",
    prescriptions: "Salbutamol, Fluticasone",
    trends: [2, 3, 2, 4, 3, 5, 4, 3, 2, 3, 4, 3],
  },
  {
    id: 3,
    name: "Vikram",
    dob: "1975-07-30",
    visits: 15,
    medicalHistory: "Coronary Artery Disease, Hyperlipidemia",
    nextAppointment: "2024-09-25",
    prescriptions: "Atorvastatin, Clopidogrel",
    trends: [8, 7, 9, 8, 7, 6, 8, 7, 9, 8, 7, 8],
  },
  {
    id: 4,
    name: "Ananya",
    dob: "1995-02-14",
    visits: 5,
    medicalHistory: "Migraine, Anxiety",
    nextAppointment: "2024-10-12",
    prescriptions: "Sumatriptan, Escitalopram",
    trends: [3, 4, 5, 4, 6, 5, 4, 3, 5, 4, 3, 4],
  },
  {
    id: 5,
    name: "Rajesh Kumar",
    dob: "1980-09-08",
    visits: 12,
    medicalHistory: "Rheumatoid Arthritis, Osteoporosis",
    nextAppointment: "2024-09-30",
    prescriptions: "Methotrexate, Alendronate",
    trends: [6, 7, 5, 6, 8, 7, 6, 5, 7, 6, 8, 7],
  },
  {
    id: 6,
    name: "Nandha",
    dob: "1998-12-03",
    visits: 3,
    medicalHistory: "Polycystic Ovary Syndrome",
    nextAppointment: "2024-10-20",
    prescriptions: "Metformin, Combined Oral Contraceptive",
    trends: [1, 2, 3, 2, 4, 3, 2, 3, 4, 3, 2, 3],
  },
  {
    id: 7,
    name: "Arjun",
    dob: "1970-05-25",
    visits: 20,
    medicalHistory:
      "Chronic Obstructive Pulmonary Disease, Gastroesophageal Reflux Disease",
    nextAppointment: "2024-09-22",
    prescriptions: "Tiotropium, Omeprazole",
    trends: [9, 8, 7, 9, 8, 7, 6, 8, 7, 9, 8, 7],
  },
  {
    id: 8,
    name: "Sonia ",
    dob: "1985-08-17",
    visits: 8,
    medicalHistory: "Hypothyroidism, Depression",
    nextAppointment: "2024-10-08",
    prescriptions: "Levothyroxine, Sertraline",
    trends: [4, 5, 4, 3, 5, 6, 5, 4, 5, 6, 5, 4],
  },
  {
    id: 9,
    name: "Karan",
    dob: "1991-06-10",
    visits: 4,
    medicalHistory: "Chronic Back Pain",
    nextAppointment: "2024-10-15",
    prescriptions: "Ibuprofen, Physical Therapy",
    trends: [3, 3, 4, 5, 5, 4, 3, 3, 2, 4, 3, 3],
  },
  {
    id: 10,
    name: "Riya",
    dob: "1995-05-25",
    visits: 6,
    medicalHistory: "Anemia, Hypothyroidism",
    nextAppointment: "2024-09-28",
    prescriptions: "Iron Supplements, Levothyroxine",
    trends: [4, 3, 4, 5, 4, 5, 5, 4, 3, 4, 3, 5],
  },
  {
    id: 11,
    name: "Aditi",
    dob: "1989-01-13",
    visits: 11,
    medicalHistory: "Gestational Diabetes, Hypertension",
    nextAppointment: "2024-10-25",
    prescriptions: "Metformin, Lisinopril",
    trends: [5, 5, 6, 5, 4, 5, 6, 5, 5, 4, 5, 5],
  },
  {
    id: 12,
    name: "Nikhil",
    dob: "1983-09-21",
    visits: 9,
    medicalHistory: "Seasonal Allergies, Eczema",
    nextAppointment: "2024-09-29",
    prescriptions: "Antihistamines, Topical Steroids",
    trends: [2, 3, 2, 3, 4, 3, 3, 4, 2, 3, 3, 2],
  },
];

const Records = () => {
  const [records, setRecords] = useState(initialRecords);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("name");

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
  };

  const handleCloseDetails = () => {
    setSelectedRecord(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };

  const filteredRecords = records
    .filter((record) =>
      record.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a[sortType] > b[sortType] ? 1 : -1));

  return (
    <div className="records-container">
      <header className="records-header">
        <h1>
          <FaUser /> Patient Records
        </h1>
        <div className="controls-section">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-bar-records"
          />
          <select
            value={sortType}
            onChange={handleSortChange}
            className="sort-dropdown"
          >
            <option value="name">Sort by Name</option>
            <option value="dob">Sort by DOB</option>
            <option value="visits">Sort by Visits</option>
          </select>
        </div>
      </header>

      <div className="records-list">
        {filteredRecords.map((record) => (
          <div className="record-card" key={record.id}>
            <div className="record-card-header">
              <h2>
                <FaUser /> {record.name}
              </h2>
              <p>
                <FaCalendarAlt /> DOB: {record.dob}
              </p>
            </div>
            <div className="record-card-body">
              <p>
                <strong>Total Visits:</strong> {record.visits}
              </p>
              <p>
                <strong>Medical History:</strong> {record.medicalHistory}
              </p>
              <p>
                <strong>Next Appointment:</strong> {record.nextAppointment}
              </p>
            </div>
            <div className="record-card-footer">
              <button
                className="view-details-button"
                onClick={() => handleViewDetails(record)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedRecord && (
        <div className="record-details-overlay">
          <div className="record-details-content">
            <header className="details-header">
              <h2>{selectedRecord.name}</h2>
              <button className="close-button" onClick={handleCloseDetails}>
                X
              </button>
            </header>
            <div className="details-body">
              <p>
                <strong>DOB:</strong> {selectedRecord.dob}
              </p>
              <p>
                <strong>Total Visits:</strong> {selectedRecord.visits}
              </p>
              <p>
                <strong>Medical History:</strong>{" "}
                {selectedRecord.medicalHistory}
              </p>
              <p>
                <strong>Next Appointment:</strong>{" "}
                {selectedRecord.nextAppointment}
              </p>
              <p>
                <strong>Prescriptions:</strong> {selectedRecord.prescriptions}
              </p>

              <div className="charts-container">
                {selectedRecord.trends && (
                  <div className="chart">
                    <h3>Visit Trends</h3>
                    <Line
                      data={{
                        labels: Array.from(
                          { length: 12 },
                          (_, i) => `Month ${i + 1}`
                        ),
                        datasets: [
                          {
                            label: "Visits",
                            data: selectedRecord.trends,
                            borderColor: "#28a745",
                            backgroundColor: "rgba(40, 167, 69, 0.2)",
                            borderWidth: 2,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: "top" },
                          tooltip: {
                            callbacks: {
                              label: (context) =>
                                `${context.dataset.label}: ${context.raw}`,
                            },
                          },
                        },
                        scales: {
                          x: { title: { display: true, text: "Month" } },
                          y: {
                            title: { display: true, text: "Number of Visits" },
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
