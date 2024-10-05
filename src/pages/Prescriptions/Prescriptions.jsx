import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Prescriptions.css";

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPrescriptionId, setCurrentPrescriptionId] = useState(null);
  const [newPrescription, setNewPrescription] = useState({
    patientName: "",
    medication: "",
    dosage: "",
    instructions: "",
    date: "",
  });

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/prescriptions"
      );
      setPrescriptions(response.data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const handleShowModal = (prescription = null) => {
    setIsEditing(!!prescription);
    setCurrentPrescriptionId(prescription ? prescription._id : null);
    setNewPrescription(
      prescription || {
        patientName: "",
        medication: "",
        dosage: "",
        instructions: "",
        date: "",
      }
    );
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setCurrentPrescriptionId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrescription((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddPrescription = async () => {
    try {
      await axios.post(
        "http://localhost:5001/api/prescriptions",
        newPrescription
      );
      fetchPrescriptions();
      handleCloseModal();
      toast.success("Prescription added successfully!");
    } catch (error) {
      toast.error("Error adding prescription");
      console.error(
        "Error adding prescription:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleEditPrescription = async () => {
    try {
      await axios.patch(
        `http://localhost:5001/api/prescriptions/${currentPrescriptionId}`,
        newPrescription
      );
      fetchPrescriptions();
      handleCloseModal();
      toast.success("Prescription updated successfully!");
    } catch (error) {
      toast.error("Error updating prescription");
      console.error(
        "Error updating prescription:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDeletePrescription = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/prescriptions/${id}`);
      fetchPrescriptions();
      toast.success("Prescription deleted successfully!");
    } catch (error) {
      toast.error("Error deleting prescription");
      console.error(
        "Error deleting prescription:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="prescriptions-container">
      <header className="prescriptions-header">
        <h1>Prescriptions</h1>
        <button
          className="add-prescription-button"
          onClick={() => handleShowModal()}
        >
          Add Prescription
        </button>
      </header>

      <div className="prescriptions-list">
        {prescriptions.map((prescription) => (
          <div className="prescription-card" key={prescription._id}>
            <div className="prescription-card-header">
              <h2>Patient Name: {prescription.patientName}</h2>
            </div>
            <div className="prescription-card-body">
              <p>Medication: {prescription.medication}</p>
              <p>Dosage: {prescription.dosage}</p>
              <p>Instructions: {prescription.instructions}</p>
              <p>Date: {new Date(prescription.date).toLocaleDateString()}</p>
            </div>
            <div className="prescription-card-footer">
              <button
                className="app-appointment__edit-button"
                onClick={() => handleShowModal(prescription)}
              >
                Edit
              </button>
              <button
                className="app-appointment__delete-button"
                onClick={() => handleDeletePrescription(prescription._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <header className="modal-header">
              <h2>{isEditing ? "Edit Prescription" : "Add Prescription"}</h2>
              <button className="close-button" onClick={handleCloseModal}>
                X
              </button>
            </header>
            <div className="modal-body">
              <form className="prescription-form">
                <div className="form-group">
                  <label htmlFor="patientName">Patient Name</label>
                  <input
                    type="text"
                    id="patientName"
                    name="patientName"
                    value={newPrescription.patientName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="medication">Medication</label>
                  <input
                    type="text"
                    id="medication"
                    name="medication"
                    value={newPrescription.medication}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dosage">Dosage</label>
                  <input
                    type="text"
                    id="dosage"
                    name="dosage"
                    value={newPrescription.dosage}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="instructions">Instructions</label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={newPrescription.instructions}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newPrescription.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button
                  className="modal__save-button"
                  type="button"
                  onClick={
                    isEditing ? handleEditPrescription : handleAddPrescription
                  }
                >
                  {isEditing ? "Update Prescription" : "Add Prescription"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Prescriptions;
