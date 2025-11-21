import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PatientRegister() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    contact: ""
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("http://127.0.0.1:5000/patientregister", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const out = await res.json();
    if (out.success) {
      setMsg("Registration successful! You can log in now.");
      setForm({ name: "", username: "", password: "", email: "", contact: "" });
      setTimeout(() => navigate("/patientlogin"), 1500);
    } else {
      setMsg(out.message || "Registration failed.");
    }
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <h2>Patient Registration</h2>
      </div>
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-row">
          <label>Name</label>
          <input
            name="name"
            type = "text"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Full Name"
          />
        </div>
        <div className="form-row">
          <label>Username</label>
          <input
            name="username"
            type = "text"
            value={form.username}
            onChange={handleChange}
            required
            placeholder="Choose a Username"
          />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Password"
          />
        </div>
        <div className="form-row">
          <label>Email</label>
          <input
            name="email"
            type="text"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email Address"
          />
        </div>
        <div className="form-row">
          <label>Contact Number</label>
          <input
            name="contact"
            type = "text"
            value={form.contact}
            onChange={handleChange}
            required
            placeholder="Contact Number"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="cta-btn">
            Register
          </button>
        </div>
        {msg && <div className="form-msg">{msg}</div>}
      </form>
    </div>
  );
}
