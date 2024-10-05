import React, { useState } from "react";
import "./Help.css";

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is the Clinic Management Dashboard?",
      answer:
        "The Clinic Management Dashboard is a platform designed to help clinic staff and doctors manage patient records, appointments, billing, and other clinic operations efficiently.",
    },
    {
      question: "How do I add a new patient record?",
      answer:
        "To add a new patient record, go to the 'Patients' section, click 'Add New Patient,' and fill in the required information, including personal details, medical history, and contact information.",
    },
    {
      question: "How can I schedule an appointment?",
      answer:
        "You can schedule an appointment by navigating to the 'Appointments' section, selecting an available time slot, and assigning it to a registered patient. You can also specify the reason for the appointment.",
    },
    {
      question: "Can I generate billing for patient services?",
      answer:
        "Yes, the dashboard allows you to generate invoices for consultations, treatments, and other services provided to patients. Simply go to the 'Billing' section to create and manage invoices.",
    },
    {
      question: "How do I manage inventory for medical supplies?",
      answer:
        "You can track and manage the clinic's medical supplies through the 'Inventory' section. It allows you to update stock levels, set alerts for low supplies, and manage orders.",
    },
    {
      question: "Is there a way to track patient history?",
      answer:
        "Yes, the 'Patients' section includes a comprehensive history for each patient, where you can view previous appointments, diagnoses, treatments, and medical notes.",
    },
    {
      question: "How secure is the patient data on the platform?",
      answer:
        "The Clinic Management Dashboard ensures data security by using encryption and other security measures to protect patient information from unauthorized access.",
    },
    {
      question: "Can I generate reports on clinic performance?",
      answer:
        "Absolutely! The dashboard provides various reports, including patient flow, financial performance, and appointment statistics, available under the 'Reports' section.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="help-section-container">
      <h1 className="help-section-title">Help & Support</h1>
      <div className="help-section-list">
        {faqs.map((faq, index) => (
          <div key={index} className="help-section-item">
            <button
              className={`help-section-question ${
                openIndex === index ? "open" : ""
              }`}
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span className="help-section-icon">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="help-section-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Help;
