import React from 'react';
import './DoctorPortal.css';
import { FaUser, FaCalendarAlt, FaFileAlt, FaEnvelope } from 'react-icons/fa';

// PatientPortal Component
const PatientPortal = ({ name, email, portalType }) => {
    const isPatient = portalType === 'Doctor';
    const isDoctor = portalType === 'Patient';

    const patientData = {
        upcomingAppointments: [
            { date: '2024-09-01', time: '10:00 AM', doctor: 'Dr. Vincent Vega' },
            { date: '2024-09-15', time: '02:00 PM', doctor: 'Dr. Jules Winnfield' },
        ],
        medicalRecords: [
            { type: 'Blood Test', date: '2024-08-15', result: 'Normal' },
            { type: 'X-Ray', date: '2024-07-22', result: 'Minor Fracture' },
        ]
    };

    return (
        <div className="patient-portal">
            <header className="portal-header">
                <h1>{isPatient ? 'Patient Portal' : 'Doctor Portal'}</h1>
                <p>Manage your health records, appointments, and messages efficiently.</p>
            </header>
            <div className="portal-content">
                <div className="profile-section">
                    <FaUser className="profile-icon" />
                    <h2>{name}</h2>
                    <p>Email: drsenthilvelan@example.com {email}</p>
                </div>
                <div className="appointments-section">
                    <h2><FaCalendarAlt /> Upcoming {isPatient ? 'Appointments' : 'Patients'}</h2>
                    <ul>
                        {patientData.upcomingAppointments.map((appt, index) => (
                            <li key={index}>
                                <strong>{appt.date}</strong> at {appt.time} with {appt.doctor}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="records-section">
                    <h2><FaFileAlt /> Medical Records</h2>
                    <ul>
                        {patientData.medicalRecords.map((record, index) => (
                            <li key={index}>
                                <strong>{record.type}</strong> - {record.date}: {record.result}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="message-section">
                    <h2><FaEnvelope /> Messages</h2>
                    <p>Send and receive messages from your healthcare providers.</p>
                    <button className="message-button">Compose Message</button>
                </div>
            </div>
        </div>
    );
};

export default PatientPortal;
