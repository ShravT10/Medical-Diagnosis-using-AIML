import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Predict from "./components/Predict1";
import Result from "./components/Result";
import History from "./components/History";
import EditRecord from "./components/EditRecord";
import Login from "./components/Login";
import Ambulance from "./components/ambulance";
import ViewAmbulanceRecords from "./components/ViewAmbulanceRecords";
import DoctorDashboard from "./components/DoctorDashboard";
import BookTest from "./components/BookTest";
import TestBookings from "./components/TestBookings";
import Bill from "./components/bill";
import PatientLogin from "./components/PatientLogin";
import PatientRegister from "./components/PatientRegister";
import LandingPage from "./components/Landing";
import ImagePredict from "./components/ImagePredict";
import "./style.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/result" element={<Result />} />
        <Route path="/login" element={<Login />} />
        <Route path="/history" element={<History />} />
        <Route path="/edit/:id" element={<EditRecord />} />
        <Route path="/ambulance" element={<Ambulance />} />
        <Route path="/ambulance-records" element={<ViewAmbulanceRecords />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/book-test" element={<BookTest />} />
        <Route path="/test-bookings" element={<TestBookings />} />
        <Route path="/bill" element={<Bill />} />
        <Route path="/patientlogin" element={<PatientLogin />} />
        <Route path="/patientregister" element={<PatientRegister />} />
        <Route path="/" element={<LandingPage />} />        
        <Route path="/image" element={<ImagePredict />} />        
      </Routes>
    </Router>
  );
}

export default App;
