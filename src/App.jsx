import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
import WardLogin from "./Pages/WardLogin";
import GovLoginPage from "./Pages/GovLoginPage";
import GovernmentDashboard from "./Pages/government/GovernmentDashboard";
import CitizenDashboard from "./Pages/citizen/CitizenDashboard";
import ComplaintsPage from "./Pages/citizen/Complaint";
import CurrentProjects from "./Pages/citizen/CurrentProjects";
import WardComplaints from "./Pages/ward/WardComplaints";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/citizen-login" element={<Login />} />
        <Route path="/citizen-register" element={<Registration />} />
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/citizen-projects" element={<CurrentProjects />} />
        <Route path="/government-dashboard" element={<GovernmentDashboard />} />
        <Route path="/ward-complaints" element={<WardComplaints />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/ward-login" element={<WardLogin />} />
        <Route path="/gov-login" element={<GovLoginPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
