import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import { createAmbulance } from "../api";

export default function Ambulance() {
  const [form, setForm] = useState({ pname: "", contact: "", location: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const out = await createAmbulance(form);
    if (out.success) {
      setMsg("Ambulance request saved.");
      setForm({ pname: "", contact: "", location: "" });
    } else {
      setMsg(out.message || "Failed to save.");
    }
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <h2>Ambulance Request</h2>
      </div>

      <form onSubmit={onSubmit} className="form-card">
        <div className="form-row">
          <label>Patient Name</label>
          <input
            name="pname"
            value={form.pname}
            onChange={onChange}
            type="text"
            placeholder="Enter full name"
            required
          />
        </div>

        <div className="form-row">
          <label>Contact</label>
          <input
            name="contact"
            value={form.contact}
            onChange={onChange}
            type="text"
            placeholder="10-digit phone"
            required
          />
        </div>

        <div className="form-row">
          <label>Location</label>
          <input
            name="location"
            value={form.location}
            onChange={onChange}
            type="text"
            placeholder="Address / landmark"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="cta-btn">Submit</button>
          <button type="button" className="btn-outline" onClick={() => navigate("/home")}>
            Cancel
          </button>
        </div>

        {msg && <p className="form-msg">{msg}</p>}
      </form>
    </div>
  );
}
