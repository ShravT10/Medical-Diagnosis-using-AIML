import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    // Uses CSS body background
    <div className="landing-page-wrap">
      
      {/* New class for the modern, professional card container */}
      <div className="landing-card"> 
        
        {/* Branding Section */}
        <div className="brand-logo">
          <span className="brand-badge-large">+</span>
          <span className="brand-title">AGATYAA Hospital</span>
        </div>
        
        <p className="landing-welcome">
          Welcome! Please select your role to continue.
        </p>
        
        {/* Buttons Section */}
        <div className="landing-actions">
          <Link to="/patientlogin">
            <button className="cta-btn full-width">Patient Login</button>
          </Link>
          <Link to="/patientregister">
            <button className="cta-btn full-width">Patient Register</button>
          </Link>
          <Link to="/login">
            <button className="btn-outline full-width mt-15">Doctor Login</button>
          </Link>
        </div>
        
      </div>
    </div>
  );
}