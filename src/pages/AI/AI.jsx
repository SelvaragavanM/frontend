import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./AI.css";

const ClinicAI = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatboxRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current.focus();
    if (messages.length === 0) {
      setMessages([
        {
          text: "Welcome to the Clinic AI Assistant! How can I assist you today? Feel free to ask about appointment scheduling, patient management, or clinic-related queries.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const newMessage = {
        text: inputValue,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputValue("");
      setIsLoading(true);

      try {
        const context = messages
          .map((msg) => `${msg.sender === "user" ? "You" : "AI"}: ${msg.text}`)
          .join("\n");
        const userMessage = `You: ${inputValue}`;

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAgMfgrUYR7xxTjtwmCukbKwfj8JXc7M_A`,
          {
            contents: [
              {
                parts: [{ text: `${context}\n${userMessage}` }],
              },
            ],
          },
          { headers: { "Content-Type": "application/json" } }
        );

        const aiResponse = response.data.candidates[0].content.parts[0].text;

        if (aiResponse) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: aiResponse, sender: "ai", timestamp: new Date() },
          ]);
        } else {
          throw new Error("No valid response from AI");
        }
      } catch (error) {
        console.error("Error fetching AI response:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: `Error: ${error.message}. Please try again.`,
            sender: "ai",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessages = () => {
    let currentSender = null;
    let messageGroup = [];
    const groupedMessages = [];

    messages.forEach((message, index) => {
      if (message.sender !== currentSender) {
        if (messageGroup.length > 0) {
          groupedMessages.push(messageGroup);
        }
        messageGroup = [message];
        currentSender = message.sender;
      } else {
        messageGroup.push(message);
      }

      if (index === messages.length - 1) {
        groupedMessages.push(messageGroup);
      }
    });

    return groupedMessages.map((group, groupIndex) => (
      <div
        key={groupIndex}
        className={`message-group ${group[0].sender}-group message-group-${groupIndex}`}
      >
        {group.map((message, messageIndex) => (
          <div
            key={messageIndex}
            className={`message ${message.sender}-message message-${messageIndex}`}
          >
            <div className="message-content">{message.text}</div>
            <div className="message-timestamp">
              {formatTimestamp(message.timestamp)}
            </div>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="clinic-ai-container">
      <header className="clinic-ai-header">
        <h1 className="clinic-ai-header-details">Smart Clinic AI Assistant</h1>
        <p className="clinic-ai-intro">
          Managing Your Clinic Made Easy: Ask about appointments, patient
          records, or clinic operations.
        </p>
      </header>
      <div className="clinic-ai-chatbox" ref={chatboxRef}>
        {renderMessages()}
        {isLoading && (
          <div className="message ai-message loading">
            <div className="loading-dots">
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
            </div>
          </div>
        )}
      </div>
      <div className="clinic-ai-input-container">
        <input
          type="text"
          className="clinic-ai-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about appointments, patient management, etc..."
          ref={inputRef}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !isLoading) {
              handleSendMessage();
            }
          }}
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          className="send-button-ai"
          disabled={isLoading}
        >
          <span className="button-text-ai">Send</span>
          <span className="button-icon-ai">🩺</span>
        </button>
      </div>
    </div>
  );
};

export default ClinicAI;
