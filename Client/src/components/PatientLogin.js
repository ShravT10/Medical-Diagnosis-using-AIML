import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link import

export default function PatientLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("http://127.0.0.1:5000/patientlogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const out = await res.json();
    if (out.success) {
      localStorage.setItem("patientLoggedIn", "true");
      localStorage.setItem("patientUsername", form.username);
      localStorage.setItem("patientName", out.name || "");
      setMsg("Login successful! Redirecting...");
      setTimeout(() => navigate("/home"), 1200); 
    } else {
      setMsg(out.message || "Login failed. Please check your credentials.");
    }
  };

  // Helper function to dynamically choose message class based on content
  const getMsgClass = (currentMsg) => {
    if (currentMsg.includes("successful")) {
      // Uses the success style defined in CSS
      return "success-message"; 
    } else if (currentMsg) {
      // Uses the error style defined in CSS for any failure message
      return "error"; 
    }
    return "";
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <h2>Patient Access</h2>
        <p className="p-muted">Sign in to view your history and predictions.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="form-card">
        
        {/* Username Field */}
        <div className="form-row">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type = "text"
            value={form.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
          />
        </div>
        
        {/* Password Field */}
        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>
        
        {/* Message Display */}
        {msg && <div className={getMsgClass(msg)}>{msg}</div>}
        
        <div className="form-actions">
          <button type="submit" className="cta-btn full-width">
            Secure Login
          </button>
        </div>
        
        <div className="center mt-20">
            {/* Added a link for better UX, uses the red theme's primary color for the link */}
            <p style={{fontSize: '14px'}}>
                Don't have an account? <Link to="/patientregister" className="text-primary-link">Register Here</Link>
            </p>
        </div>
      </form>
    </div>
  );
}