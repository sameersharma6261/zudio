import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import React, { useState, useEffect } from "react";
import axios from "axios";

function EditDisplay() {
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
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8); // 50% quality

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
  position: absolute;
  padding-top: 25px;
  top: 5555px;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}






.edit-box {
  background: rgba(255, 255, 255, 0.1); /* Glassmorphism Effect */
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 50px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 50%;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.edit-box input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: black;
  outline: none;
  transition: 0.3s;
}

.edit-box input::placeholder {
   color: black;
}

.edit-box input:focus {
  background: rgba(255, 255, 255, 0.3);
}

.edit-box button {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  background: linear-gradient(to right, rgb(56, 250, 208), rgb(127, 189, 255));
  color: black;
  cursor: pointer;
  transition: 0.3s ease-in-out;
}

.edit-box button:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(255, 126, 95, 0.3);
}

button {
  cursor: pointer;
  padding: 10px 20px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  background: linear-gradient(to right, rgb(56, 250, 208), rgb(127, 189, 255));
  color: black;
  transition: 0.3s ease-in-out;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(255, 126, 95, 0.3);
  }
    }
  .buttt{
  display: flex;
  justify-content: center;}

  .whole{
  height: 100%;
  width: 100vh;
  padding: 0;
  margin: 0;

  }
  body{
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

      `}</style>
<div className="whole">
      <div className="buttt">
        <button onClick={() => setIsEditing(!isEditing)}>Edit</button>
      </div>
      {isEditing && (
        <div className="edit-box">
          <input type="file" onChange={handleImageChange} />
          <input
            type="text"
            value={phoenixText}
            onChange={(e) => setPhoenixText(e.target.value)}
            placeholder="Edit Animation Name"
          />
          <input
            type="text"
            value={pText}
            onChange={(e) => setPText(e.target.value)}
            placeholder="Z"
          />
          <input
            type="text"
            value={royalPassText}
            onChange={(e) => setRoyalPassText(e.target.value)}
            placeholder="Service Name"
          />
          <button onClick={handleUpdate}>Save</button>
        </div>
      )}
      </div>
      {/* 
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
        </div> */}
    </>
  );
}

export default EditDisplay;
