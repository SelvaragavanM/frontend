import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientComponent = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/patients`)
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the patients!', error);
      });
  }, []);

  return (
    <div>
      <h1>Patients</h1>
      <ul>
        {patients.map(patient => (
          <li key={patient._id}>{patient.name} - {patient.age} years old</li>
        ))}
      </ul>
    </div>
  );
};

export default PatientComponent;
