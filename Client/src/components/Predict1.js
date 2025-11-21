import React, { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import { createPrediction } from "../api";

export default function Predict() {
  const [form, setForm] = useState({ glucose: "", bmi: "", age: "" , symptom : "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem("patientUsername");
    const data1 = { ...form, username };
    const result = await createPrediction(data1);
    navigate("/result", { state: { result: result.prediction } });
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <h2>Enter details</h2>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        {/* <div className="form-row">
          <label>Patient Name</label>
          <input
            name="Pname"
            placeholder="Name"
            value={form.Pname}
            onChange={handleChange}
            type="text"
            required
          />
        </div> */}

        {/* <div className="form-row">
          <label>Contact</label>
          <input
            name="contact"
            placeholder="Contact"
            value={form.contact}
            onChange={handleChange}
            type="text"
            required
          />
        </div> */}

        <div className="form-row">
          <label>Glucose</label>
          <input
            name="glucose"
            placeholder="Glucose"
            value={form.glucose}
            onChange={handleChange}
            type="number"
            step="any"
            required
          />
        </div>

        <div className="form-row">
          <label>BMI</label>
          <input
            name="bmi"
            placeholder="BMI"
            value={form.bmi}
            onChange={handleChange}
            type="number"
            step="any"
            required
          />
        </div>

        <div className="form-row">
          <label>Age</label>
          <input
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            type="number"
            min="0"
            required
          />
        </div>

        
        <div className="form-row">
          <label>Symptoms</label>
          <textarea
            name="symptom"
            placeholder="Describe symptoms in detail (e.g., frequent urination, increased thirst, fatigue)..."
            value={form.symptom}
            onChange={handleChange}
            rows={6}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="cta-btn">Enroll</button>
          <Link to="/home"><button type="button" className="cta-btn">Cancel</button></Link>
        </div>
      </form>
    </div>
  );
}
