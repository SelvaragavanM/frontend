import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "./Appointments.css";
import {
  FaUser,
  FaCalendar,
  FaClock,
  FaPhone,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [date, setDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  const handleShowModal = (appointment = null) => {
    setEditingAppointment(
      appointment
        ? { ...appointment }
        : { name: "", date: "", time: "", phone: "" }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAppointment(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrEditAppointment = async () => {
    if (
      !editingAppointment.name ||
      !editingAppointment.date ||
      !editingAppointment.time ||
      !editingAppointment.phone
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(editingAppointment.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      let newAppointment;
      if (editingAppointment._id) {
        const response = await axios.put(
          `http://localhost:5001/api/appointments/${editingAppointment._id}`,
          editingAppointment
        );
        newAppointment = response.data;
        toast.success("Appointment updated successfully!");
      } else {
        const response = await axios.post(
          "http://localhost:5001/api/appointments/",
          editingAppointment
        );
        newAppointment = response.data;
        toast.success("Appointment added successfully!");
      }
      setAppointments((prevAppointments) => [
        ...prevAppointments.filter((appt) => appt._id !== newAppointment._id),
        newAppointment,
      ]);
      handleCloseModal();
    } catch (error) {
      console.error("Error adding/updating appointment:", error);
      toast.error("Failed to add/update appointment. Please try again.");
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/appointments/${id}`);
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== id)
      );
      toast.success("Appointment deleted successfully!");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Failed to delete appointment. Please try again.");
    }
  };

  const isDateWithAppointment = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return appointments.some(
      (appointment) => appointment.date === formattedDate
    );
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/appointments/"
        );
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    getData();
  }, []);

  return (
    <div className="app-appointments__container">
      <ToastContainer />
      <header className="app-appointments__header">
        <h1 className="app-appointments__title">Appointments</h1>
        <button
          className="app-appointments__add-button"
          onClick={() => handleShowModal()}
        >
          <FaPlus className="app-appointments__add-icon" />
          Add Appointment
        </button>
      </header>

      <div className="app-appointments__search-bar">
        <FaSearch className="app-appointments__search-icon" />
        <input
          type="text"
          placeholder="Search appointments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="app-appointments__search-input"
        />
      </div>

      <div className="app-appointments__grid">
        {filteredAppointments.map((appointment) => (
          <div className="app-appointment__card" key={appointment._id}>
            <div className="app-appointment__card-header">
              <h2 className="app-appointment__name">
                <FaUser className="app-appointment__icon" /> {appointment.name}
              </h2>
            </div>
            <div className="app-appointment__card-body">
              <p className="app-appointment__detail">
                <FaCalendar className="app-appointment__icon" />
                <span className="app-appointment__label">Date:</span>{" "}
                {appointment.date}
              </p>
              <p className="app-appointment__detail">
                <FaClock className="app-appointment__icon" />
                <span className="app-appointment__label">Time:</span>{" "}
                {appointment.time}
              </p>
              <p className="app-appointment__detail">
                <FaPhone className="app-appointment__icon" />
                <span className="app-appointment__label">Phone:</span>{" "}
                {appointment.phone}
              </p>
            </div>
            <div className="app-appointment__card-footer">
              <button
                className="app-appointment__edit-button"
                onClick={() => handleShowModal(appointment)}
              >
                Edit
              </button>
              <button
                className="app-appointment__delete-button"
                onClick={() => handleDeleteAppointment(appointment._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="app-appointments__calendar-container">
        <Calendar
          onChange={setDate}
          value={date}
          tileClassName={({ date, view }) =>
            view === "month" && isDateWithAppointment(date)
              ? "app-appointments__calendar-tile--highlighted"
              : null
          }
          next2Label={null}
          prev2Label={null}
          nextLabel="&#x276F;"
          prevLabel="&#x276E;"
        />
      </div>

      {showModal && (
        <div className="app-appointments__modal-overlay">
          <div className="app-appointments__modal-content">
            <header className="app-appointments__modal-header">
              <h2 className="app-appointments__modal-title">
                {editingAppointment?._id
                  ? "Edit Appointment"
                  : "Add New Appointment"}
              </h2>
              <button
                className="app-appointments__modal-close"
                onClick={handleCloseModal}
              >
                X
              </button>
            </header>
            <div className="app-appointments__modal-body">
              <form className="app-appointments__form">
                <div className="app-appointments__form-group">
                  <label
                    htmlFor="name"
                    className="app-appointments__form-label"
                  >
                    Patient Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editingAppointment?.name || ""}
                    onChange={handleInputChange}
                    required
                    className="app-appointments__form-input"
                  />
                </div>
                <div className="app-appointments__form-group">
                  <label
                    htmlFor="date"
                    className="app-appointments__form-label"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={editingAppointment?.date || ""}
                    onChange={handleInputChange}
                    required
                    className="app-appointments__form-input"
                  />
                </div>
                <div className="app-appointments__form-group">
                  <label
                    htmlFor="time"
                    className="app-appointments__form-label"
                  >
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={editingAppointment?.time || ""}
                    onChange={handleInputChange}
                    required
                    className="app-appointments__form-input"
                  />
                </div>
                <div className="app-appointments__form-group">
                  <label
                    htmlFor="phone"
                    className="app-appointments__form-label"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={editingAppointment?.phone || ""}
                    onChange={handleInputChange}
                    required
                    className="app-appointments__form-input"
                  />
                </div>
                <button
                  type="button"
                  className="app-appointments__submit-button"
                  onClick={handleAddOrEditAppointment}
                >
                  {editingAppointment?._id ? "Save Changes" : "Add Appointment"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
