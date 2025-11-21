import React, { useState } from "react";
import { Link } from "react-router-dom";

// --- CONFIGURATION ---
// !!! IMPORTANT: Set your actual Flask API endpoint URL here !!!
const API_PREDICT_URL = "http://127.0.0.1:5000/predict_xray"; 
// -----------------------

export default function ImagePredict() {
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [successMessage, setSuccessMessage] = useState(null); 
  
  // const navigate = useNavigate();

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setSuccessMessage(null); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      alert("Please select a Chest X-ray image to upload.");
      return;
    }
    
    setIsLoading(true);
    setSuccessMessage(null); 

    // 1. Retrieve username from localStorage
    const username = localStorage.getItem("patientUsername");
    
    // 2. Prepare FormData for file upload
    const formData = new FormData();
    
    // Append the file first
    formData.append("xray_image", imageFile); 
    formData.append("username", username); 
    
    try {
      // 3. Direct JavaScript 'fetch' call to your Flask API
      const response = await fetch(API_PREDICT_URL, {
        method: 'POST',
        // The browser handles setting the correct Content-Type for FormData
        body: formData,
      });

      // 4. Handle Successful Server Acknowledgment (Async process started)
      if (response.ok) {
        setSuccessMessage("Image Uploaded Please wait the staff will get to you soon.");
        setImageFile(null); 
      } else {
        throw new Error(`Server acknowledgment failed with status: ${response.status}`);
      }
      
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`Upload failed. Error: ${error.message}. Please check API URL and server status.`);
      setSuccessMessage(null);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <h2>Pneumonia Prediction</h2>
        <h3>Upload your Chest X-ray</h3>
      </div>

      <form onSubmit={handleSubmit} className="form-card" encType="multipart/form-data">
        
        
        <div className="form-row file-upload-container">
          <label htmlFor="xray-file-input" className="file-upload-label">
            {imageFile ? `File Selected: ${imageFile.name}` : 'Choose X-ray Image (.jpg, .png)'}
          </label>
          <input
            id="xray-file-input"
            name="xray_image"
            onChange={handleFileChange}
            type="file"
            accept="image/jpeg, image/png"
            required
            style={{ display: 'none' }}
          />
        </div>
        
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="cta-btn" 
            disabled={isLoading || !imageFile}
          >
            {isLoading ? "Uploading..." : "Run Prediction"}
          </button>
          
          <Link to="/home">
            <button type="button" className="cta-btn" disabled={isLoading}>
              Cancel
            </button>
          </Link>
        </div>
        
        {/* FEEDBACK MESSAGES */}
        {isLoading && <p className="loading-message">Image upload in progress. Please wait...</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        
      </form>
    </div>
  );
}