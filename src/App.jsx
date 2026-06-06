import React from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
import WardLogin from "./Pages/WardLogin";
import GovLoginPage from "./Pages/GovLoginPage";
import GovernmentDashboard from "./Pages/government/GovernmentDashboard";
import CitizenDashboard from "./Pages/citizen/CitizenDashboard";
import ComplaintsPage from "./Pages/citizen/Complaint";
import CurrentProjects from "./Pages/citizen/CurrentProjects";
import VillageChat from "./Pages/citizen/VillageChat";
import WardComplaints from "./Pages/ward/WardComplaints";
const App = () => {
  const location = useLocation();
  const showCitizenChat = [
    "/citizen-dashboard",
    "/citizen-projects",
    "/complaints",
    "/citizen-chat",
  ].some((path) => location.pathname.startsWith(path));

  return (
    <div>
      {showCitizenChat && location.pathname !== "/citizen-chat" && (
        <Link
          to="/citizen-chat"
          style={{
            position: "fixed",
            right: "20px",
            bottom: "20px",
            zIndex: 50,
            textDecoration: "none",
            background: "linear-gradient(135deg, #0f172a, #2563eb)",
            color: "white",
            padding: "14px 18px",
            borderRadius: "999px",
            fontWeight: 700,
            boxShadow: "0 14px 30px rgba(37, 99, 235, 0.28)",
          }}
        >
          Chat with Village AI
        </Link>
      )}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/citizen-login" element={<Login />} />
        <Route path="/citizen-register" element={<Registration />} />
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/citizen-projects" element={<CurrentProjects />} />
        <Route path="/citizen-chat" element={<VillageChat />} />
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
