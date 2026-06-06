import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearStoredAuth,
  getCurrentUser,
  getStoredAuth,
  getVillageDashboard,
  logoutUser,
  setStoredAuth,
} from "../../api/villageApi";

export default function WardDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getStoredAuth();
    if (!session?.token) {
      navigate("/ward-login");
      return;
    }

    let active = true;

    const loadDashboard = async () => {
      try {
        const meResponse = await getCurrentUser();
        const user = meResponse?.data?.user || session.user;
        if (!active) return;

        setProfile(user || session.user || null);
        setStoredAuth({ token: session.token, user: user || session.user });

        if (!user?.village) {
          throw new Error("Ward dashboard needs a village on the logged-in profile.");
        }

        const response = await getVillageDashboard(user.village);

        if (!active) return;
        setDashboard(response?.data?.village_dashboard || null);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Unable to load ward dashboard.");
        if (err.status === 401) {
          clearStoredAuth();
          navigate("/ward-login");
        }
      } finally {
        if (active) setLoading(false);
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
      // Ignore stateless logout errors and clear the client session anyway.
    } finally {
      clearStoredAuth();
      navigate("/ward-login");
    }
  };

  const recentProjects = dashboard?.recent_projects || dashboard?.projects || [];
  const recentComplaints = dashboard?.recent_complaints || dashboard?.complaints || [];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "28px" }}>
              Ward Dashboard{profile?.full_name ? ` - ${profile.full_name}` : ""}
            </h1>
            <p style={{ margin: "8px 0 0", color: "#64748b" }}>
              {profile?.village ? `Village: ${profile.village}` : "Ward account connected to backend data."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/ward-complaints")}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              background: "#fff",
              color: "#0f172a",
              cursor: "pointer",
              fontWeight: 700,
              marginRight: "12px",
            }}
          >
            Manage Complaints
          </button>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              border: "none",
              background: "#0f766e",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Logout
          </button>
        </div>

        {loading && <p style={{ marginTop: "24px" }}>Loading ward dashboard...</p>}
        {error && <p style={{ marginTop: "24px", color: "#dc2626" }}>{error}</p>}

        {dashboard && (
          <div style={{ marginTop: "24px", display: "grid", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
              <Metric title="Projects" value={dashboard.project_totals?.total_projects ?? 0} />
              <Metric title="Complaints" value={dashboard.complaint_totals?.total ?? 0} />
              <Metric title="Feedback" value={dashboard.feedback_totals?.total ?? 0} />
              <Metric title="Schemes" value={dashboard.scheme_totals?.total ?? 0} />
            </div>

            <Section title="Recent Projects" items={recentProjects} />
            <Section title="Recent Complaints" items={recentComplaints} />
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div style={{ padding: "18px", borderRadius: "16px", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
      <div style={{ color: "#64748b", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{title}</div>
      <div style={{ fontSize: "32px", fontWeight: 800, marginTop: "8px" }}>{value}</div>
    </div>
  );
}

function Section({ title, items }) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "18px" }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <div style={{ display: "grid", gap: "12px" }}>
        {items.length ? (
          items.map((item, index) => (
            <div key={item._id || item.id || index} style={{ padding: "12px", borderRadius: "12px", background: "#f8fafc" }}>
              <div style={{ fontWeight: 700 }}>{item.name || item.title || item.complaint_number || "Untitled"}</div>
              <div style={{ color: "#64748b", fontSize: "14px" }}>
                {item.status || item.workflow_stage || item.category || "No status"}
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#64748b" }}>No records found.</p>
        )}
      </div>
    </div>
  );
}
