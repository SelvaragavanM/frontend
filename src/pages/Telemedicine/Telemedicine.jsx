import React, { useState, useEffect, useRef } from "react";
import "./Telemedicine.css";
import { FaVideo, FaPhoneAlt, FaEnvelope, FaUser } from "react-icons/fa";
import { auth, db, logout } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { query, collection, onSnapshot, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const iceServers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const Telemedicine = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        toast.success(`Welcome back, ${user.email}!`);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const q = query(collection(db, "messages"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesArray = [];
        querySnapshot.forEach((doc) => {
          messagesArray.push(doc.data());
        });
        setMessages(messagesArray);
      });
      return () => unsubscribe();
    };

    fetchMessages();
  }, []);
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(iceServers);

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
      }
    };

    return pc;
  };

  const startMediaStream = async (video = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video,
        audio: true,
      });
      setLocalStream(stream);
      localVideoRef.current.srcObject = stream;
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const handleVideoCall = async () => {
    const pc = createPeerConnection();
    setPeerConnection(pc);
    await startMediaStream(true);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
  };

  const handleVoiceCall = async () => {
    const pc = createPeerConnection();
    setPeerConnection(pc);
    await startMediaStream(false);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
  };

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
  };

  const handleSendMessage = async () => {
    const message = "Hello, this is a test message!";
    try {
      await addDoc(collection(db, "messages"), {
        text: message,
        timestamp: new Date(),
      });
      toast.success("Message sent!");
    } catch (error) {
      toast.error("Error sending message: " + error.message);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="tm-container">
      <header className="tm-header">
        <h1 className="tm-title">Telemedicine</h1>
        <p className="tm-subtitle">
          Manage virtual consultations efficiently with our integrated tools.
        </p>
      </header>
      <div className="tm-content">
        <div className="tm-actions">
          <div className="tm-action-card tm-animate-card">
            <FaVideo className="tm-action-icon" />
            <h2 className="tm-action-title">Start Video Call</h2>
            <p className="tm-action-description">
              Begin a live video consultation with your patients seamlessly.
            </p>
            <button className="tm-button tm-primary" onClick={handleVideoCall}>
              Start Video Call
            </button>
            <button className="tm-button tm-secondary" onClick={handleEndCall}>
              End Call
            </button>
          </div>
          <div className="tm-action-card tm-animate-card">
            <FaPhoneAlt className="tm-action-icon" />
            <h2 className="tm-action-title">Start Voice Call</h2>
            <p className="tm-action-description">
              Initiate a voice call for quick and effective consultations.
            </p>
            <button className="tm-button tm-primary" onClick={handleVoiceCall}>
              Start Voice Call
            </button>
            <button className="tm-button tm-secondary" onClick={handleEndCall}>
              End Call
            </button>
          </div>
          <div className="tm-action-card tm-animate-card">
            <FaEnvelope className="tm-action-icon" />
            <h2 className="tm-action-title">Send Messages</h2>
            <p className="tm-action-description">
              Communicate with patients securely through our messaging system.
            </p>
            <button
              className="tm-button tm-primary"
              onClick={handleSendMessage}
            >
              Send Message
            </button>
          </div>
        </div>
        <div className="tm-schedule">
          <h2 className="tm-schedule-title">Upcoming Consultations</h2>
          <ul className="tm-schedule-list">
            <li className="tm-schedule-item">
              <FaUser className="tm-schedule-icon" />
              <strong className="tm-patient-name">Akash </strong>
              <span className="tm-consultation-type">Video Call</span>
              <span className="tm-consultation-time">
                Aug 30, 2024, 10:00 AM
              </span>
            </li>
            <li className="tm-schedule-item">
              <FaUser className="tm-schedule-icon" />
              <strong className="tm-patient-name">Karthik Raj</strong>
              <span className="tm-consultation-type">Voice Call</span>
              <span className="tm-consultation-time">
                Aug 30, 2024, 11:00 AM
              </span>
            </li>
            <li className="tm-schedule-item">
              <FaUser className="tm-schedule-icon" />
              <strong className="tm-patient-name">Ramkumar</strong>
              <span className="tm-consultation-type">Message</span>
              <span className="tm-consultation-time">
                Aug 31, 2024, 02:00 PM
              </span>
            </li>
          </ul>
        </div>
        <div className="tm-video-container">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="tm-local-video"
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="tm-remote-video"
          />
        </div>
      </div>
    </div>
  );
};

export default Telemedicine;
