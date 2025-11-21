import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getHistory, deleteRecord } from "../api";

export default function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("doctorLoggedIn");
    if (!isLoggedIn) {
      alert("You must be logged in as a doctor to view history");
      navigate("/login");
      return;
    }
    
    loadHistory();
  }, [navigate]);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await deleteRecord(id);
      setHistory(history.filter((row) => row[0] !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("doctorLoggedIn");
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Prediction History</h2>
        <button onClick={handleLogout} style={{ padding: "10px 20px" }}>
          Logout
        </button>
      </div>

      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient Name</th>
            <th>Glucose</th>
            <th>BMI</th>
            <th>Age</th>
            <th>Result</th>
            <th>Symptoms</th>
            <th>Possible Disease</th>
            <th>Image Based Disease</th>
            <th>Contact</th>

            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.map((row) => (
              <tr key={row[0]}>
                <td>{row[0]}</td>
                <td>{row[6]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
                <td>{row[4]}</td>
                <td>{row[15]}</td>
                <td>{row[5]}</td>
                <td>{row[14]}</td>
                <td>{row[7]}</td>
                <td>
                  <Link to={`/edit/${row[0]}`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(row[0])}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No history available
              </td>
            </tr>
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
