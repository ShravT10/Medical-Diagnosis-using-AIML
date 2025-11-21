import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAmbulance } from "../api";

export default function ViewAmbulanceRecords() {
  const [rows, setRows] = useState([]);

  const load = async () => {
    const data = await getAmbulance();
    setRows(data);
  };

  useEffect(() => { load(); }, []);

//   const onDelete = async (id) => {
//     if (!window.confirm("Delete this record?")) return;
//     await deleteAmbulance(id);
//     setRows(rows.filter(r => r[0] !== id));
//   };

  return (
    <div>
      <h2>Ambulance Requests</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Contact</th>
            <th>Location</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? rows.map(r => (
            <tr key={r[0]}>
              <td>{r[0]}</td>
              <td>{r[1]}</td>
              <td>{r[2]}</td>
              <td>{r[3]}</td>
              <td>{new Date(r[4]).toLocaleString()}</td>
            </tr>
          )) : (
            <tr><td colSpan="6" style={{ textAlign: "center" }}>No records</td></tr>
          )}
        </tbody>
      </table>
      <div style={{ marginTop: "20px" }}>
        <Link to="/doctor-dashboard">
          <button>Back Home</button>
        </Link>
      </div>
    </div>
  );
}
