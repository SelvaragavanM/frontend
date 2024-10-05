import React, { useState } from "react";
import "./LoginPopup.css";
import { login, signup } from "../../../firebase";
import { useNavigate } from "react-router-dom";

const LoginPopup = ({ setShowLogin, onLoginSuccess }) => {
  const [currState, setCurrState] = useState("Login");
  const [isPanelSelection, setIsPanelSelection] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateInputs = () => {
    if (currState === "Sign Up") {
      if (!firstName || !lastName || !email || !password) {
        setError("All fields are required.");
        return false;
      }
    } else if (currState === "Login") {
      if (!email || !password) {
        setError("Email and password are required.");
        return false;
      }
    }
    return true;
  };

  const handleAuthAction = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setError("");

    try {
      if (currState === "Login") {
        await login(email, password);
      } else {
        await signup(`${firstName} ${lastName}`, email, password);
      }
      setIsPanelSelection(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePanelSelection = (panelType) => {
    if (typeof onLoginSuccess === "function") {
      onLoginSuccess(panelType);
    }
    navigate("/patient-portal");
    setShowLogin(false);
  };

  return (
    <div className="login-popup">
      <div className="login-popup-container">
        <div className="login-popup-header">
          <h2>{currState}</h2>
          <button className="close-btn" onClick={() => setShowLogin(false)}>
            &times;
          </button>
        </div>
        <div className="login-popup-body">
          {currState === "Sign Up" && (
            <>
              <input
                className="firstname-input"
                placeholder="First Name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                className="lastname-input"
                placeholder="Last Name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </>
          )}
          <input
            type="email"
            placeholder="Your Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <button
            className="auth-button"
            onClick={handleAuthAction}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : currState === "Sign Up"
              ? "Create Account"
              : "Login"}
          </button>
          <div className="terms">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              By continuing, I agree to the terms of use & privacy policy.
            </label>
          </div>
          <div className="switch-auth">
            {currState === "Login" ? (
              <p>
                New here?{" "}
                <span onClick={() => setCurrState("Sign Up")}>
                  Create an Account
                </span>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <span onClick={() => setCurrState("Login")}>Login here</span>
              </p>
            )}
          </div>
        </div>
      </div>
      {isPanelSelection && (
        <div className="panel-selection">
          <h2>Select Your Panel</h2>
          <button onClick={() => handlePanelSelection("Patient")}>
            Patient Panel
          </button>
          <button onClick={() => handlePanelSelection("Doctor")}>
            Doctor Panel
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginPopup;
