import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  clearStoredAuth,
  getCurrentUser,
  getListItems,
  getStoredAuth,
  listProjects,
  logoutUser,
  setStoredAuth,
} from "../../api/villageApi";

export default function CurrentProjects() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const session = getStoredAuth();
    if (!session?.token) {
      navigate("/citizen-login");
      return;
    }

    let active = true;

    const load = async () => {
      try {
        const meResponse = await getCurrentUser();
        const user = meResponse?.data?.user || session.user;
        if (!active) return;

        setProfile(user || session.user || null);
        setStoredAuth({ token: session.token, user: user || session.user });

        const projectsResponse = await listProjects(
          {
            village: user?.village || session.user?.village || undefined,
            status: "active",
            page_size: 20,
          },
          false,
        );

        if (!active) return;
        setProjects(getListItems(projectsResponse));
      } catch (err) {
        if (!active) return;
        setError(err.message || "Unable to load projects.");
        if (err.status === 401) {
          clearStoredAuth();
          navigate("/citizen-login");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Stateless logout should still continue locally.
    } finally {
      clearStoredAuth();
      navigate("/citizen-login");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#f8fafc" }}>
      <aside
        style={{
          width: "240px",
          background: "linear-gradient(180deg, #16a34a 0%, #15803d 100%)",
          color: "#fff",
          padding: "24px",
        }}
      >
        <h2 style={{ fontFamily: "var(--font-display)", marginBottom: "40px" }}>VillageX</h2>

        <NavLink to="/citizen-dashboard" style={sidebarLink}>
          Dashboard
        </NavLink>
        <NavLink to="/citizen-projects" style={sidebarLink}>
          Projects
        </NavLink>
        <NavLink to="/complaints" style={sidebarLink}>
          Complaints
        </NavLink>

        <button type="button" onClick={handleLogout} style={logoutButton}>
          Logout
        </button>
      </aside>

      <main style={{ flex: 1, padding: "30px" }}>
        <section style={card}>
          <h1 style={titleStyle}>Current Projects</h1>
          <p style={{ color: "#64748b", marginTop: 0 }}>
            Projects tracked for {profile?.village ? profile.village : "your village"}.
          </p>

          {error && <div style={errorBanner}>{error}</div>}

          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length ? (
            <div style={{ display: "grid", gap: "16px" }}>
              {projects.map((project, index) => (
                <article
                  key={project._id || project.id || index}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "18px",
                    background: "#fff",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                    <div>
                      <h3 style={{ margin: 0 }}>{project.name || project.title || "Untitled project"}</h3>
                      <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                        {project.category || project.workflow_stage || "Project"}
                      </p>
                    </div>
                    <span style={statusBadge(project.status)}>{project.status || "active"}</span>
                  </div>

                  <div style={{ marginTop: "14px" }}>
                    <div style={progressBar}>
                      <div
                        style={{
                          ...progressFill,
                          width: `${Math.max(0, Math.min(100, project.progress_percent ?? 0))}%`,
                        }}
                      />
                    </div>
                    <p style={{ margin: "8px 0 0", color: "#475569" }}>
                      Progress: {Math.round(project.progress_percent ?? 0)}%
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>No active projects found for your village.</p>
          )}
        </section>
      </main>
    </div>
  );
}

const card = {
  background: "#fff",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "var(--vx-shadow-card)",
  border: "1px solid #e2e8f0",
};

const titleStyle = {
  fontFamily: "var(--font-display)",
  marginTop: 0,
  marginBottom: "16px",
};

const sidebarLink = {
  display: "block",
  padding: "12px",
  borderRadius: "10px",
  marginBottom: "10px",
  color: "#fff",
  textDecoration: "none",
  background: "rgba(255, 255, 255, 0.12)",
  fontWeight: 600,
};

const logoutButton = {
  width: "100%",
  marginTop: "18px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid rgba(255, 255, 255, 0.35)",
  background: "rgba(255, 255, 255, 0.12)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "600",
};

const errorBanner = {
  marginBottom: "16px",
  padding: "12px 14px",
  borderRadius: "10px",
  background: "#fef2f2",
  color: "#b91c1c",
  border: "1px solid #fecaca",
};

const statusBadge = (status) => ({
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "13px",
  background: String(status).toLowerCase() === "completed" ? "var(--vx-green-100)" : "var(--vx-blue-100)",
  color: String(status).toLowerCase() === "completed" ? "var(--vx-green-700)" : "var(--vx-blue-700)",
});

const progressBar = {
  width: "100%",
  height: "8px",
  borderRadius: "999px",
  background: "#e2e8f0",
  overflow: "hidden",
};

const progressFill = {
  height: "100%",
  borderRadius: "999px",
  background: "var(--vx-green-600)",
};
