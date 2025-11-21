import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const isDoctor = localStorage.getItem("doctorLoggedIn") === "true";

  return (
    <div className="dash-wrap">
      
      <header className="dash-header">
        <div className="brand">
          <span className="brand-badge">+</span>
          <h1>AGATYAA Hospital</h1>
        </div>
        <nav className="actions">
          {isDoctor ? (
            <Link to="/"><button className="btn-solid">Logout</button></Link>
          ) : (
            <Link to="/"><button className="btn-solid">Logout</button></Link>
          )}
        </nav>
      </header>

      
      <section className="stats-row">
        
          <div className="stat-card">
            <p className="stat-label">Today’s Submissions</p>
            <p className="stat-value">21</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Diabetic Flags</p>
            <p className="stat-value">10</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Pending Reviews</p>
            <p className="stat-value">6</p>
          </div>
        
      </section>

      
      <section className="tiles">
        <div className="tile">
          <h2>Enroll yourself</h2>
          <p>Enter details to create a appointment.</p>
          <Link to="/predict"><button className="cta-btn">Start Now</button></Link>
        </div>

        <div className="tile">
          <h2>Lungs</h2>
          <p>Upload Chest X-ray to Daignose</p>
          <Link to="/image"><button className="cta-btn">Check </button></Link>
        </div>
      </section>
      <section className="tiles tiles-bottom">
         <div className="tile">
            <h2>Book an emergency ambulance</h2> 
            <p>Enter location and an ambulance will arrive shortly.</p>
            <Link to="/ambulance"><button className="cta-btn">Book now</button></Link> 
          </div>
          <div className="tile">
            <h2>Book a Test</h2> 
            <p>Choose from the various tests you want take.</p>
            <Link to="/book-test"><button className="cta-btn">Book now</button></Link> 
          </div>

      </section>
    </div>
  );
}
