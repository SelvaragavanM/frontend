import React, { useState, useEffect } from "react";
import "./Patients.css";
import {
  FaUser,
  FaBirthdayCake,
  FaGenderless,
  FaPhone,
  FaEnvelope,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useSpring, animated } from "@react-spring/web";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    problem: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/patients");
        setPatients(response.data);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
        setError("Failed to fetch patients. Please try again.");
        toast.error("Failed to fetch patients.");
      }
    };

    fetchPatients();
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
    setNewPatient({
      name: "",
      dob: "",
      gender: "",
      phone: "",
      email: "",
      problem: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    if (Object.values(newPatient).some((field) => field.trim() === "")) {
      setError("Please fill in all fields.");
      toast.error("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const handleAddPatient = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post("http://localhost:5001/api/patients", newPatient);
      setNewPatient({
        name: "",
        dob: "",
        gender: "",
        phone: "",
        email: "",
        problem: "",
      });
      handleCloseModal();
      const response = await axios.get("http://localhost:5001/api/patients");
      setPatients(response.data);
      toast.success("Patient added successfully!");
    } catch (err) {
      setError("Failed to add patient. Please try again.");
      toast.error("Failed to add patient.");
    } finally {
      setLoading(false);
    }
  };

  const modalAnimation = useSpring({
    opacity: showModal ? 1 : 0,
    transform: showModal ? "translateY(0)" : "translateY(-30px)",
    config: { tension: 220, friction: 25 },
  });

  return (
    <div className="patients__wrapper">
      <header className="patients__header">
        <h1 className="patients__title">Patients List</h1>
        <button className="patients__add-button" onClick={handleShowModal}>
          Add Patient
        </button>
      </header>
      <div className="patients__grid">
        {patients.map((patient) => (
          <animated.div className="patient__card" key={patient._id}>
            <div className="patient__card-header">
              <h2 className="patient__name">
                <FaUser className="patient__icon" /> {patient.name}
              </h2>
            </div>
            <div className="patient__card-body">
              <p className="patient__info">
                <FaExclamationTriangle className="patient__icon" />
                <span className="patient__label">Problem:</span>{" "}
                {patient.problem}
              </p>
              <p className="patient__info">
                <FaBirthdayCake className="patient__icon" />
                <span className="patient__label">Date of Birth:</span>{" "}
                {patient.dob}
              </p>
              <p className="patient__info">
                <FaGenderless className="patient__icon" />
                <span className="patient__label">Gender:</span> {patient.gender}
              </p>
              <p className="patient__info">
                <FaPhone className="patient__icon" />
                <span className="patient__label">Phone:</span> {patient.phone}
              </p>
              <p className="patient__info">
                <FaEnvelope className="patient__icon" />
                <span className="patient__label">Email:</span> {patient.email}
              </p>
            </div>
          </animated.div>
        ))}
      </div>

      {showModal && (
        <animated.div
          className="modal__overlay"
          style={modalAnimation}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-patient-title"
        >
          <div className="modal__content">
            <header className="modal__header">
              <h2 id="add-patient-title" className="modal__title">
                Add New Patient
              </h2>
              <button
                className="modal__close-button"
                onClick={handleCloseModal}
                aria-label="Close modal"
              >
                X
              </button>
            </header>
            <div className="modal__body">
              {error && <p className="modal__error-message">{error}</p>}
              <form className="modal__form">
                <div className="modal__form-group">
                  <label htmlFor="name" className="modal__label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newPatient.name}
                    onChange={handleInputChange}
                    aria-required="true"
                    className="modal__input"
                  />
                </div>
                <div className="modal__form-group">
                  <label htmlFor="dob" className="modal__label">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={newPatient.dob}
                    onChange={handleInputChange}
                    aria-required="true"
                    className="modal__input"
                  />
                </div>
                <div className="modal__form-group">
                  <label htmlFor="gender" className="modal__label">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={newPatient.gender}
                    onChange={handleInputChange}
                    aria-required="true"
                    className="modal__select"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="modal__form-group">
                  <label htmlFor="phone" className="modal__label">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={newPatient.phone}
                    onChange={handleInputChange}
                    aria-required="true"
                    className="modal__input"
                  />
                </div>
                <div className="modal__form-group">
                  <label htmlFor="email" className="modal__label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newPatient.email}
                    onChange={handleInputChange}
                    aria-required="true"
                    className="modal__input"
                  />
                </div>
                <div className="modal__form-group">
                  <label htmlFor="problem" className="modal__label">
                    Problem
                  </label>
                  <input
                    type="text"
                    id="problem"
                    name="problem"
                    value={newPatient.problem}
                    onChange={handleInputChange}
                    aria-required="true"
                    className="modal__input"
                  />
                </div>
              </form>
            </div>
            <div className="modal__footer">
              <button
                className="modal__save-button"
                onClick={handleAddPatient}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </animated.div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Patients;
