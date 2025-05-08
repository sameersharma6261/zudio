import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(`${process.env.REACT_APP_API_BASE_URL}`);

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(180); // Initial 180 seconds
  const [progress, setProgress] = useState(0); // Background fill progress
  const [showMessage, setShowMessage] = useState(false); // Show thank-you message

  useEffect(() => {
    // Fetch Initial Countdown
    fetch(`${process.env.REACT_APP_API_BASE_URL}/get-countdown`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          startCountdown(data.startTime, data.duration);
        }
      });

    // Listen for countdown start from server
    socket.on("countdown-start", ({ startTime, duration }) => {
      startCountdown(startTime, duration);
    });

    return () => socket.off("countdown-start");
  }, []);

  const startCountdown = (startTime, duration) => {
    const endTime = startTime + duration * 1000;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);

      // Calculate progress percentage
      const percentageFilled = ((180 - remaining) / 180) * 100;
      setProgress(percentageFilled);

      if (remaining === 0) {
        clearInterval(interval);
        setTimeout(() => setShowMessage(true), 1500); // Show message after a delay
      }
    }, 1000);
  };

  return (
    <div
      style={{
        ...styles.container,
        background: `linear-gradient(to top, blue ${progress}%, white ${progress}%)`,opacity:"30%",
      }}
    >
      {showMessage ? (
        <div style={styles.message} className="fade-in">
          Thank's for VISIT
        </div>
      ) : (
        <div style={styles.circle}>{timeLeft}</div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    position: "fixed",
    left: "0",
    overflow: "hidden",
    bottom: "0",
    transition: "background 1s linear",
  },
  circle: {
    width: "160px",
    height: "160px",
    backgroundColor: "white",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "40px",
    fontWeight: "bold",
    position: "absolute",
    bottom: "22%",
    color: "black",
    boxShadow: "0 0 30px rgba(48, 48, 48, 0.8)",
    animation: "pulse 1s infinite alternate ease-in-out",
    zIndex: 2,
  },
  message: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    position: "absolute",
    bottom: "28%",
    opacity: 0,
    overflow: "hidden",
    animation: "fadeIn 2s forwards",
  },
};

// Inject CSS animations dynamically
const styleElement = document.createElement("style");
styleElement.innerHTML = `
  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 20px rgba(48, 48, 48, 0.8);
    }
    100% {
      transform: scale(1.3);
      box-shadow: 0 0 40px rgba(48, 48, 48, 0.8);
    }
  }

  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleElement);

export default Countdown;
