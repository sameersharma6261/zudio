

import React, { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import axios from "axios";
import "./Token.css";

function Token() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(!token); // Load only if token is not in localStorage

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-token?phone=${localStorage.getItem("phone")}`);
        console.log("Token Response:", response.data);
        setToken(response.data.token);
        // localStorage.setItem("token", response.data.token); // Save in local storage
      } catch (error) {
        console.error("Error fetching token:", error);
        alert("Failed to fetch token. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (!token) {
      fetchToken(); // Only fetch if token is not in localStorage
    }
  }, [token]);

  useGSAP(() => {
    gsap.fromTo(
      ".circle",
      { boxShadow: "0px 0px 20px 5px rgba(255, 255, 255, 0.5)" },
      { boxShadow: "0px 0px 50px 15px rgba(255, 255, 255, 0.8)", duration: 2, repeat: -1, yoyo: true }
    );

    gsap.fromTo(
      "body",
      { backgroundPosition: "0% 0%" },
      { backgroundPosition: "100% 100%", duration: 6, repeat: -1, yoyo: true, ease: "linear" }
    );

    gsap.from(".text", { scale: 0, duration: 2, opacity: 0, ease: "elastic.out" });

    gsap.from(".wave-text", { y: 100, delay: 1, duration: 1, opacity: 0, ease: "elastic.out" });
  }, []);

  return (
    <div className="container">
      <p className="text">Your Token Number has been Generated</p>
      <div className="circleh">
        {loading ? <span id="token-number">Loading...</span> : <span id="token-number">{token || "Error"}</span>}
      </div>
      <div className="wave-text" style={{ fontSize: "25px" }}>
        <p>Your Red Carpet is going to open for you shortly! Your exclusive invite will land straight on your mobile through sms.</p>
      </div>
    </div>
  );
}

export default Token;
