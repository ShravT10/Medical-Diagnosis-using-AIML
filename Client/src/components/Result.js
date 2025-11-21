import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Result() {
  const location = useLocation();
  const result = location.state?.result || "No result available";

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>We have scheduled your appointment. Please wait</h1>
      <h2>However from your information we have predicted that</h2>
      <h3 style={{ marginTop: 10 }}>You are: {result}</h3>

      <div style={{ marginTop: "30px" }}>
        <Link to="/predict">
          <button style={{ margin: "10px" }}>Try Again</button>
        </Link>
        <Link to="/home">
          <button style={{ margin: "10px" }}>Back Home</button>
        </Link>
      </div>
    </div>
  );
}