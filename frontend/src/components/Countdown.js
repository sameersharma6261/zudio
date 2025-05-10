import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";

const socket = io(`${process.env.REACT_APP_API_BASE_URL}`);

const Countdown = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [data, setData] = useState({ name: '', phone: '', email: '', token: '' });
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(180); // Initial 180 seconds
  const [progress, setProgress] = useState(0); // Background fill progress
  const [showMessage, setShowMessage] = useState(false); // Show thank-you message

   useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('devmode') === 'true') {
      setShowInfo(true);

      setData({
        name: params.get('name') || '',
        phone: params.get('phone') || '',
        email: params.get('email') || '',
        token: params.get('token') || '',
      });
    }
  }, []);

  const handleSecretClick = () => {
    // Navigate to any route you want
    navigate('/counter'); // <-- change this to your desired path
  };

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");
    if (!hasReloaded) {
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload();
    }
  }, []);

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
        background: `linear-gradient(to top,rgb(29, 26, 26) ${progress}%, white ${progress}%)`,
        opacity: "30%",
      }}
    >
      {showMessage ? (
        <>
          <div style={styles.message} className="fade-in">
            Thank's for VISIT
          </div>
        </>
      ) : (
        <>
         {showInfo && (
        <div className="info-table-wrapper">
          <table className="info-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile Number</th>
                <th>Email</th>
                <th>Token</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data.name}</td>
                <td>{data.phone}</td>
                <td>{data.email}</td>
                <td>{data.token}</td>
              </tr>
            </tbody>
          </table>

          <button className="dev-only-button" onClick={handleSecretClick}>
           Back To Yoyr Counter
          </button>
        </div>
      )}
      <style>{`.info-table-wrapper {
  width: 100vw;
  overflow-x: auto;
  padding: 20px;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Segoe UI', sans-serif;
}

.info-table thead {
  background: linear-gradient(to right, #4b3e3e, #6b3f2d);
  color: white;
}

.info-table th,
.info-table td {
  padding: 12px 16px;
  text-align: center;
  border: 1px solid #333;
}

.info-table tbody {
  background-color: #1c1c1c;
  color: #d6fdfd;
  font-weight: bold;
}

.dev-only-button {
  margin-top: 20px;
  padding: 10px 18px;
  background-color: #ff6600;
  border: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
  border-radius: 6px;
}`}</style>
          <div style={styles.circle}>{timeLeft}</div>
        </>
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
