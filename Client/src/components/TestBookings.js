import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:5000";

export default function TestBookings() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, [navigate]);

  const load = async () => {
    const res = await fetch(`${API_URL}/history`);
    const data = await res.json();
    setRows(data);
  };

  const pretty = (v) => {
    if (v == null) return "-";
    return String(v);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Booked Tests</h2>
        <Link to="/"><button className="btn-outline">Back Home</button></Link>
      </div>

      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: 20, background: "#fff" }}>
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Patient Name</th>
            <th>Tests</th>
          </tr>
        </thead>
        <tbody>
          {rows && rows.length > 0 ? (
            rows.map((row) => (
              <tr key={row[0]}>
                <td>{row[0]}</td>
                <td>{pretty(row[6])}</td>
                <td style={{ whiteSpace: "pre-wrap" }}>{pretty(row[9])}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>No records</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
