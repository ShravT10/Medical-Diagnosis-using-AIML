import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function DoctorDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const ok = localStorage.getItem("doctorLoggedIn") === "true";
    if (!ok) {
      alert("Doctor login required");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="dash-wrap">
      {/* Header with logo and logout */}
      <header className="dash-header">
        <div className="brand">
          <span className="brand-badge">TT</span>
          <h1>ThynkTech Hospital · Doctor</h1>
        </div>
        <nav className="actions">
          <Link to="/"><button className="btn-outline">Home</button></Link>
          <button
            className="btn-solid"
            onClick={() => {
              localStorage.removeItem("doctorLoggedIn");
              navigate("/");
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      {/* All tiles in a single grid section */}
      <section className="tiles">
        <div className="tile">
          <h2>Check Patient Appointments</h2>
          <p>Review and manage diabetes prediction records.</p>
          <Link to="/history">
            <button className="cta-btn">Open Records</button>
          </Link>
        </div>

        <div className="tile">
          <h2>Check Ambulance Requests</h2>
          <p>See and manage all ambulance assistance entries.</p>
          <Link to="/ambulance-records">
            <button className="cta-btn">View Ambulance</button>
          </Link>
        </div>

        <div className="tile">
          <h2>Test Bookings</h2>
          <p>View patients and tests they've booked.</p>
          <Link to="/test-bookings">
            <button className="cta-btn">Open</button>
          </Link>
        </div>

        <div className="tile">
          <h2>Generate Bill</h2>
          <p>Create an itemized bill by patient ID.</p>
          <Link to="/bill">
            <button className="cta-btn">Open</button>
          </Link>
        </div>
      </section>
    </div>
  );
}
