import React, { useState } from "react";
import "./Doctors.css";
import {
  FaUser,
  FaStethoscope,
  FaPhone,
  FaEnvelope,
  FaSearch,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const doctors = [
  {
    id: 1,
    name: "Dr. Priya",
    specialty: "Cardiologist",
    phone: "+91 98765 43210",
    email: "drpriyaka@example.com",
  },
  {
    id: 2,
    name: "Dr. Rajesh",
    specialty: "Dermatologist",
    phone: "+91 87654 32109",
    email: "drrajesh@example.com",
  },
  {
    id: 3,
    name: "Dr. Aisha Kannan",
    specialty: "Dermatologist",
    phone: "+91 76543 21098",
    email: "draishakannan@example.com",
  },
  {
    id: 4,
    name: "Dr. Gopalakrishnan",
    specialty: "Ophthalmologist",
    phone: "+91 65432 10987",
    email: "drgopalakrishnan@example.com",
  },
  {
    id: 5,
    name: "Dr. Senthil Velan",
    specialty: "Cardiologist",
    phone: "+91 54321 09876",
    email: "drsenthilvelan@example.com",
  },
  {
    id: 6,
    name: "Dr. Sundar Ramasamy",
    specialty: "Pulmonologist",
    phone: "+91 43210 98765",
    email: "drsundarramasamy@example.com",
  },
  {
    id: 7,
    name: "Dr. Raja Durai",
    specialty: "Pulmonologist",
    phone: "+91 32109 87654",
    email: "drrajadurai@example.com",
  },
  {
    id: 8,
    name: "Dr. Varun",
    specialty: "Cardiologist",
    phone: "+91 21098 76543",
    email: "drvarun@example.com",
  },
  {
    id: 9,
    name: "Dr. Meera",
    specialty: "Dermatologist",
    phone: "+91 10987 65432",
    email: "drmeera@example.com",
  },
  {
    id: 10,
    name: "Dr. Anand Kumar",
    specialty: "Pulmonologist",
    phone: "+91 98765 43211",
    email: "dranandkumar@example.com",
  },
  {
    id: 11,
    name: "Dr. Sneha",
    specialty: "Ophthalmologist",
    phone: "+91 87654 32110",
    email: "drsneha@example.com",
  },
  {
    id: 12,
    name: "Dr. Karunakaran",
    specialty: "Dermatologist",
    phone: "+91 76543 21099",
    email: "drkarunakaran@example.com",
  },
];

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleBookNow = async (doctor) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/doctors/book",
        doctor
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to book doctor");
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="doctors-container">
      <header className="doctors-header">
        <h1>Our Esteemed Doctors</h1>
      </header>
      <div className="doctors-list">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div className="doctor-card" key={doctor.id}>
              <div className="doctor-card-header">
                <div className="doctor-avatar">
                  <FaUser className="avatar-icon" />
                </div>
                <h2 className="doctor-name">{doctor.name}</h2>
                <p className="doctor-specialty">{doctor.specialty}</p>
              </div>
              <div className="doctor-card-body">
                <p>
                  <FaPhone /> {doctor.phone}
                </p>
                <p>
                  <FaEnvelope /> {doctor.email}
                </p>
              </div>
              <div className="doctor-card-footer">
                <button
                  className="book-now-button"
                  onClick={() => handleBookNow(doctor)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No doctors found</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Doctors;
