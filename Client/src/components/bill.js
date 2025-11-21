import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getBill } from "../api";

export default function Bill() {
  const [patientId, setPatientId] = useState("");
  const [bill, setBill] = useState(null);
  const [error, setError] = useState("");

  const fetchBill = async (e) => {
    e.preventDefault();
    setError("");
    setBill(null);
    const out = await getBill(Number(patientId));
    if (out.success) {
      setBill(out);
    } else {
      setError(out.message || "Patient not found.");
    }
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <h2>Patient Bill</h2>
      </div>

      <form onSubmit={fetchBill} className="form-card">
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
        <div className="form-actions">
          <button className="cta-btn" type="submit">Get Bill</button>
        </div>
        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
      </form>

      {bill && (
        <div className="form-card" style={{ marginTop: 20 }}>
          <h3>Bill Details</h3>
          <table border="1" cellPadding="10" style={{ width: "100%", marginTop: 10 }}>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Appointment Fees</th>
                <th>Tests</th>
                <th>Total Bill</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{bill.patient_name || "-"}</td>
                <td>₹800</td>
                <td>{bill.tests || "-"}</td>
                <td>₹{bill.total_bill}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: 16 }}>
            <button className="btn-outline" onClick={() => window.print()}>Print</button>
          </div>
          <div className="header-actions">
          <Link to="/home"><button className="btn-outline">Back Home</button></Link>
            </div>
        </div>
      )}
    </div>
  );
}
