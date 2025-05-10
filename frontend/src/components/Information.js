import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import "./Information.css";
import { useNavigate } from "react-router";
import axios from "axios";

function Information() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Form input, 2: OTP input
  const [isLoading, setIsLoading] = useState(false); // Loading state for showing the popup
  const [emailError, setEmailError] = useState(""); // State for email error message
  const [isEmailValid, setIsEmailValid] = useState(false); // State for email validity
  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (e) => {
    e.preventDefault(); // Prevent form submission

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email pattern

    if (!emailPattern.test(email)) {
      alert("please insert valid email"); // Set error message
      setIsEmailValid(false); // Set email validity to false
    } else {
      setEmailError(""); // Clear error message
      setIsEmailValid(true); // Set email validity to true
    }
  };

  // Prevent page refresh
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Some browsers require this
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // GSAP animations
  useGSAP(() => {
    gsap.from(".heading", {
      scale: 0,
      duration: 2,
      opacity: 0,
      ease: "lastic.out",
      fontStyle: "rajdhani",
    });
    gsap.from(".name", {
      scale: 0,
      duration: 2,
      opacity: 0,
      ease: "lastic.out",
    });
    gsap.from(".mobile-no", {
      scale: 0,
      duration: 2,
      opacity: 0,
      ease: "lastic.out",
    });
    gsap.from(".gmail", {
      scale: 0,
      duration: 2,
      opacity: 0,
      ease: "lastic.out",
    });
    gsap.from(".buy-pass button", {
      y: 100,
      delay: 1,
      duration: 2,
      opacity: 0,
      ease: "lastic.out",
    });
  }, []);

  // Generate a unique token
  const generateToken = () => {
    return Math.floor(Math.random() * 1000) + 1; // Random number between 1 and 1000
  };


  // Send OTP
  const sendOtp = async () => {
    if (!mobile) {
      alert("Please enter your mobile number");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
  
    if (
      name === "editdisplay" &&
      mobile === "1234567890" &&
      email === "editdisplay@gmail.com"
    ) {
      navigate("/editdisplay");
      return;
    }
  
    if (
      name === "counter" &&
      mobile === "1234567890" &&
      email === "counter@gmail.com"
    ) {
      navigate("/counter");
      return;
    }
  
    const token = generateToken();
    setIsLoading(true);
  
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/send-otp`,
        {
          mobile,
          name,
          email,
          token,
        }
      );
  
      if (data.success) {
        localStorage.setItem("phone", mobile); // store mobile
        setStep(2); // move to OTP input step
      } else {
        alert("Failed to send OTP");
      }
    } catch (error) {
      alert("Error sending OTP: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };


  // Verify OTP
  const verifyOtp = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/verify-otp`,
        {
          mobile,
          otp,
        }
      );

      if (response.data.success) {
        // OTP verify hone ke baad data save karo
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/information`,
          {
            name,
            mobile,
            email,
            token: generateToken(),
          }
        );

        alert("OTP verified successfully!");
        navigate("/paymentpage");
      } else {
        alert("Invalid OTP, please try again!");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Invalid OTP, please try again!");
    }
  };

  return (
    <>
      {/* Loading Popup */}
      {isLoading && (
        <div className="popup">
          <div className="popup-content">Just wait for your OTP...</div>
        </div>
      )}

      <div className="contact-form">
        <div className="heading">Register Yourself </div>

        {/* Display email error message */}
        {emailError && <div className="error-message">{emailError}</div>}

        {step === 1 && (
          <>
            <div className="name">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mobile-no">
              <input
                type="tel"
                id="mobile"
                name="mobile"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
            <div className="gmail">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your mail"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(""); // Clear error message on input change
                  setIsEmailValid(false); // Reset email validity on change
                }}
                onBlur={validateEmail} // Validate email on input blur
                required
              />
            </div>
            <div className="buy-pass">
              <button
                type="button"
                onClick={sendOtp}
                disabled={!isEmailValid} // Disable button if email is not valid
              >
                Send OTP
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
          <div className="abcd">
            <div className="otp">
              <h1>Enter your OTP</h1>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter the OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div className="buy-pass">
              
              <button type="button" onClick={verifyOtp}>
                Verify OTP
              </button>
            </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Information;
