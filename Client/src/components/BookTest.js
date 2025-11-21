import React, { useState } from "react";
import { Link } from "react-router-dom";
import { bookTest } from "../api";

const AVAILABLE_TESTS = [
  "Fasting Blood Sugar",
  "HbA1c",
  "Lipid Profile",
  "CBC",
  "Urine Routine",
  "Kidney Function (KFT)",
  "Liver Function (LFT)"
];

export default function BookTest() {
  const [patientId, setPatientId] = useState("");
  const [selected, setSelected] = useState([]);
  const [msg, setMsg] = useState("");

  const toggleTest = (t) => {
    setSelected((prev) =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!patientId || selected.length === 0) {
      setMsg("Enter Patient ID and select at least one test.");
      return;
    }
    const out = await bookTest({ patient_id: Number(patientId), tests: selected });
    if (out.success) {
      setMsg(`Booked. `);
      setSelected([]);
      setPatientId("");
    } else {
      setMsg(out.message || "Booking failed.");
    }
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <h2>Book a Test</h2>
        <div className="header-actions">
          <Link to="/home"><button className="btn-outline">Back Home</button></Link>
        </div>
      </div>

      <form onSubmit={submit} className="form-card">
        <div className="form-row">
          <label>Patient ID</label>
          <input
            type="number"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Enter patient ID"
            required
          />
        </div>

        <div className="form-row">
          <label>Select Tests</label>
          <div className="test-grid">
            {AVAILABLE_TESTS.map((t) => (
              <label key={t} className="test-option">
                <input
                  type="checkbox"
                  checked={selected.includes(t)}
                  onChange={() => toggleTest(t)}
                />
                <span>{t}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="cta-btn">Book Tests</button>
          <button type="button" className="btn-outline" onClick={() => { setSelected([]); setPatientId(""); setMsg(""); }}>
            Clear
          </button>
        </div>

        {msg && <p className="form-msg">{msg}</p>}
      </form>
    </div>
  );
}
