import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import React, { useState, useEffect } from "react";
import axios from "axios";

function Display() {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [phoenixText, setPhoenixText] = useState("");
  const [pText, setPText] = useState("");
  const [royalPassText, setRoyalPassText] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch existing data from MongoDB
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/display`)
      .then((res) => {
        const data = res.data || {}; // ✅ Fix: Prevents errors if res.data is null
        setBackgroundImage(data.backgroundImage || "");
        setPhoenixText(data.phoenixText || "");
        setPText(data.pText || "");
        setRoyalPassText(data.royalPassText || "");
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []); // Runs once on component mount

  // Handle updates
  const handleUpdate = async () => {
    try {
      const updatedData = {
        backgroundImage,
        phoenixText,
        pText,
        royalPassText,
      };

      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/display`, updatedData);
      alert("Updated Successfully!");

      // ✅ Instead of making another GET request, update state directly
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating:", error);
      alert("Error updating. Please check console for details.");
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set max width and height for compression
          const maxWidth = 800;
          const maxHeight = 800;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;
            if (width > height) {
              width = maxWidth;
              height = width / aspectRatio;
            } else {
              height = maxHeight;
              width = height * aspectRatio;
            }
          }

          // Resize image
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to compressed Base64 (Reduce quality)
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.9); // 50% quality

          setBackgroundImage(compressedBase64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // GSAP Animations
  useGSAP(() => {
    gsap.from(".p", { scale: 0, duration: 2 });
    gsap.from(".royal-pass", { scale: 0, duration: 2 });
    gsap.from(".circle-container", {
      duration: 4,
      opacity: 0,
      ease: "elastic.out",
    });
  }, []);

  return (
    <>
      {/* Injecting CSS directly in the component */}
      <style>{`
        *{
    margin: 0;
    padding: 0;
}
.animated-display{
  height: 35vh;
  /* background-color: red; */
  width: 100%;
  position: fixed;
  padding-top: 25px;
  top: 5px;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
 .circle-container {
    margin: 0;
    padding: 0;
    position: relative;
    height: 35vh;
    /* background-color: green; */
    width: 85%;
    border-top-right-radius: 150px;
    border-bottom-right-radius: 150px;
    overflow: hidden; /* Ensures text outside the circle is hidden */
    background-image: url(https://cdn.pixabay.com/photo/2014/02/01/18/01/money-256319_960_720.jpg);
    background-position: center;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Wrapper to hold two texts */
.slider-wrapper {
 font-family: 'Rajdhani', sans-serif;
  display: flex;
  align-items: center;
  width: max-content;
  animation: slide 30s linear infinite;
}

/* Sliding Text */
.slider-text {
  white-space: nowrap;
  font-size: 250px;
  font-weight: 900;
  opacity: 100%;
  line-height: 1;
  // background: linear-gradient(90deg, #f5f3f6, #dad7d7, #ad6749, #c4bfbf);
  background: white;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-right: 50px; /* Space between two texts */
}

/* Keyframes */
@keyframes slide {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}


.circle-container-text{
  /* background-color: rgb(7, 7, 21); */
  opacity: 100%;
  position: absolute;
  height: 100%;
  width: 85%;
  border-top-right-radius: 150px;
  border-bottom-right-radius: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
}
.p{
  /* background-color: green; */
  padding: 5px;
  width: 100%;
  font-style: rajdhani;
  position: absolute;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;    
  height: 35vh;
  color: white;
  font-size: 300px;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.royal-pass{
    position: absolute;
    bottom: 60px;
    left: 70px;
    padding: 0;
    margin: 0;
    font-family: 'Rajdhani', sans-serif;
    font-size: 45px;
  font-weight: 900;
  background: linear-gradient(90deg, #f5f3f6, #3498db, #f1c40f );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  overflow: hidden;
}
@media screen and (max-width: 440px) {
  .royal-pass{
    font-size: 34px;
    bottom: 65px;
  }
}

      `}</style>
      <div className="display-container">
        {/* <button onClick={() => setIsEditing(!isEditing)}>Edit</button> */}

        {isEditing && (
          <div className="edit-box">
            <input type="file" onChange={handleImageChange} />
            <input
              type="text"
              value={phoenixText}
              onChange={(e) => setPhoenixText(e.target.value)}
              placeholder="Edit Phoenix Text"
            />
            <input
              type="text"
              value={pText}
              onChange={(e) => setPText(e.target.value)}
              placeholder="Edit P Text"
            />
            <input
              type="text"
              value={royalPassText}
              onChange={(e) => setRoyalPassText(e.target.value)}
              placeholder="Edit Royal Pass Text"
            />
            <button onClick={handleUpdate}>Save</button>
          </div>
        )}

        <div className="animated-display">
          <div
            className="circle-container"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <div className="slider-wrapper">
              <div className="slider-text">{phoenixText}</div>
              <div className="slider-text">{phoenixText}</div>
            </div>
          </div>
          <div className="circle-container-text">
            <div className="p">{pText}</div>
            <div className="royal-pass">{royalPassText}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Display;
