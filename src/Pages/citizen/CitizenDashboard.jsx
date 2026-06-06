import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  clearStoredAuth,
  getCurrentUser,
  getListItems,
  getStoredAuth,
  listComplaints,
  listProjects,
  logoutUser,
  setStoredAuth,
} from "../../api/villageApi";

const defaultAnnouncements = [
  {
    title: "Village Meeting",
    date: "15 June 2026",
  },
  {
    title: "Health Camp",
    date: "20 June 2026",
  },
];

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [announcements] = useState(defaultAnnouncements);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const cardStyle = {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "var(--vx-shadow-card)",
    border: "1px solid var(--vx-slate-200)",
  };

  useEffect(() => {
    const session = getStoredAuth();
    if (!session?.token) {
      navigate("/citizen-login");
      return;
    }

    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const meResponse = await getCurrentUser();
        const user = meResponse?.data?.user || session.user;
        if (!active) return;

        setProfile(user || session.user || null);
        setStoredAuth({ token: session.token, user: user || session.user });

        const [projectsResponse, complaintsResponse] = await Promise.all([
          listProjects(
            {
              village: user?.village || session.user?.village || undefined,
              status: "active",
              page_size: 6,
            },
            false,
            true,
          ),
          listComplaints({ mine: true, page_size: 6 }, true),
        ]);

        if (!active) return;

        setProjects(getListItems(projectsResponse).slice(0, 6));
        setComplaints(getListItems(complaintsResponse).slice(0, 6));
      } catch (err) {
        console.error("Error loading dashboard:", err);
        if (!active) return;
        setError(err.message || "Unable to load the citizen dashboard.");
        if (err.status === 401) {
          clearStoredAuth();
          navigate("/citizen-login");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Stateless logout should still fall through locally.
    } finally {
      clearStoredAuth();
      navigate("/citizen-login");
    }
  };

  const projectCards = projects.map((project, index) => ({
    id: project._id || project.id || index,
    name: project.name || project.title || "Untitled Project",
    progress: Number(
      project.progress_percent ??
        project.summary_metrics?.progress_percent ??
        project.progress ??
        0,
    ),
    status:
      project.status ||
      project.workflow_stage ||
      project.summary_metrics?.status ||
      "active",
  }));

  const complaintCards = complaints.map((item, index) => ({
    title:
      item.title ||
      item.subject ||
      item.complaint_number ||
      `Complaint ${index + 1}`,
    status: item.status || "open",
  }));

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--vx-slate-50)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          background: "var(--vx-green-600)",
          color: "#fff",
          padding: "24px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            marginBottom: "40px",
          }}
        >
          VillageX
        </h2>

        <nav>
          <NavLink
            to="/citizen-dashboard"
            style={({ isActive }) => ({
              display: "block",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "10px",
              color: "#fff",
              textDecoration: "none",
              background: isActive ? "rgba(255, 255, 255, 0.18)" : "transparent",
              fontWeight: isActive ? "700" : "500",
            })}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/complaints"
            style={({ isActive }) => ({
              display: "block",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "10px",
              color: "#fff",
              textDecoration: "none",
              background: isActive ? "rgba(255, 255, 255, 0.18)" : "transparent",
              fontWeight: isActive ? "700" : "500",
            })}
          >
            Complaints
          </NavLink>

          <NavLink
            to="/citizen-projects"
            style={({ isActive }) => ({
              display: "block",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "10px",
              color: "#fff",
              textDecoration: "none",
              background: isActive ? "rgba(255, 255, 255, 0.18)" : "transparent",
              fontWeight: isActive ? "700" : "500",
            })}
          >
            Projects
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            width: "100%",
            marginTop: "18px",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.35)",
            background: "rgba(255, 255, 255, 0.12)",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Logout
        </button>
      </aside>

      {/* Content */}
      <main
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
        {/* Welcome */}
        <div
          style={{
            ...cardStyle,
            background: "var(--vx-green-50)",
            marginBottom: "24px",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              marginBottom: "10px",
            }}
          >
            Welcome Back{profile?.full_name ? `, ${profile.full_name}` : ""}
          </h1>

          <p
            style={{
              color: "var(--vx-slate-600)",
            }}
          >
            Stay updated with development activities in your village.
          </p>
        </div>

        {loading && (
          <div
            style={{
              ...cardStyle,
              marginBottom: "24px",
            }}
          >
            Loading dashboard data...
          </div>
        )}

        {error && (
          <div
            style={{
              ...cardStyle,
              marginBottom: "24px",
              color: "var(--vx-rose-700)",
            }}
          >
            {error}
          </div>
        )}

        {/* Projects */}
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              marginBottom: "16px",
            }}
          >
            Active Projects
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: "20px",
            }}
          >
            {projectCards.map((project) => (
              <div key={project.id} style={cardStyle}>
                <h3>{project.name}</h3>

                <p
                  style={{
                    color: "var(--vx-slate-500)",
                    margin: "8px 0",
                  }}
                >
                  {project.status}
                </p>

                <div
                  style={{
                    height: "8px",
                    background: "var(--vx-slate-200)",
                    borderRadius: "999px",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(0, Math.min(100, project.progress))}%`,
                      height: "100%",
                      borderRadius: "999px",
                      background: "var(--vx-green-600)",
                    }}
                  />
                </div>

                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                  }}
                >
                  {Math.round(project.progress)}% Completed
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements + Complaints */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* Announcements */}
          <div style={cardStyle}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                marginBottom: "16px",
              }}
            >
              Announcements
            </h2>

            {announcements.length > 0 ? (
              announcements.map((item, index) => (
                <div
                  key={item._id || item.id || index}
                  style={{
                    paddingBottom: "14px",
                    marginBottom: "14px",
                    borderBottom: "1px solid var(--vx-slate-200)",
                  }}
                >
                  <h4 style={{ marginBottom: "4px" }}>{item.title || item.name || "Announcement"}</h4>
                  <p
                    style={{
                      color: "var(--vx-slate-500)",
                      fontSize: "14px",
                      margin: 0,
                    }}
                  >
                    {item.date || (item.created_at ? new Date(item.created_at).toLocaleDateString() : "Recently posted")}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: "var(--vx-slate-500)" }}>No announcements available.</p>
            )}
          </div>

          {/* Complaints */}
          <div style={cardStyle}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                marginBottom: "16px",
              }}
            >
              My Complaints
            </h2>

            {complaintCards.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "14px",
                  marginBottom: "14px",
                  borderBottom: "1px solid var(--vx-slate-200)",
                }}
              >
                <span>{item.title}</span>

                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "999px",
                    background:
                      String(item.status).toLowerCase() === "resolved"
                        ? "var(--vx-green-100)"
                        : "var(--vx-blue-100)",
                    color:
                      String(item.status).toLowerCase() === "resolved"
                        ? "var(--vx-green-700)"
                        : "var(--vx-blue-700)",
                    fontSize: "13px",
                  }}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
