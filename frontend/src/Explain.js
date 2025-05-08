import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import React from "react";
import { useEffect } from "react";
import "./Explain.css";
import { Link } from "react-router";

function Explain() {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      document.getElementById("buyButton").click();
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  
  useGSAP(() => {
    gsap.from(".text-content h2", {
      x: 200,
      duration: 2,
      opacity: 0,
      ease: "lastic.out",
    });

    gsap.from(".text-content p", {
      x: -200,
      duration: 2,
      opacity: 0,
      ease: "lastic.out",
    });

    gsap.from(".text-content button", {
      y: 100,
      delay: 1,
      duration: 2,
      opacity: 0,
      ease: "lastic.out",
    });
  }, []);
  return (
    <div>
      <div className="explaination">
        <div className="text-content">
          <h2>Welcome<br></br>To <br></br>ZUDIO Red Carpet</h2>
          <p>
          <h1 className="head">Zudio is where fashion meets affordability – and now, we’re turning up the glam.</h1>
          "Red Carpet Zudio is here – a premium feature for trendsetters. Scan, shop, pay, and glow. It's your moment to shine!"
          </p>
          <Link to={"/information"}>
            <button id="buyButtonn" onClick={() => (" ")}>
              Buy Cart
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Explain;
