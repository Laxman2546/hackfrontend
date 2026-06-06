import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearStoredAuth,
  getCurrentUser,
  getListItems,
  getStoredAuth,
  listComplaints,
  logoutUser,
  setStoredAuth,
  updateComplaint,
} from "../../api/villageApi";

const STATUS_OPTIONS = [
  { label: "Pending", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "resolved" },
];

export default function WardComplaints() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");
  const [notice, setNotice] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
  });

  useEffect(() => {
    const session = getStoredAuth();
    if (!session?.token) {
      navigate("/ward-login");
      return;
    }

    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const meResponse = await getCurrentUser();
        const user = meResponse?.data?.user || session.user;
        if (!active) return;

        setProfile(user || session.user || null);
        setStoredAuth({ token: session.token, user: user || session.user });

        const response = await listComplaints(
          {
            village: user?.village || session.user?.village || undefined,
            status: filters.status !== "all" ? filters.status : undefined,
            page_size: 100,
          },
          true,
        );

        if (!active) return;
        setComplaints(getListItems(response));
      } catch (err) {
        if (!active) return;
        setError(err.message || "Unable to load complaints.");
        if (err.status === 401) {
          clearStoredAuth();
          navigate("/ward-login");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [filters.status, navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Clear local session either way.
    } finally {
      clearStoredAuth();
      navigate("/ward-login");
    }
  };

  const handleStatusChange = (complaintId) => async (event) => {
    const status = event.target.value;
    setSavingId(complaintId);
    setNotice("");
    setError("");

    try {
      await updateComplaint(complaintId, { status });
      const response = await listComplaints(
        {
          village: profile?.village || undefined,
          status: filters.status !== "all" ? filters.status : undefined,
          page_size: 100,
        },
        true,
      );
      setComplaints(getListItems(response));
      setNotice("Complaint status updated.");
    } catch (err) {
      setError(err.message || "Unable to update complaint.");
      if (err.status === 401) {
        clearStoredAuth();
        navigate("/ward-login");
      }
    } finally {
      setSavingId("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "28px" }}>Ward Complaints</h1>
            <p style={{ margin: "8px 0 0", color: "#64748b" }}>
              {profile?.village ? `Village: ${profile.village}` : "Complaints assigned to your ward area."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <select
              value={filters.status}
              onChange={(e) => setFilters((current) => ({ ...current, status: e.target.value }))}
              style={{ padding: "12px 14px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "#fff" }}
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleLogout}
              style={{ padding: "12px 16px", borderRadius: "12px", border: "none", background: "#0f766e", color: "#fff", cursor: "pointer", fontWeight: 700 }}
            >
              Logout
            </button>
          </div>
        </div>

        {loading && <p style={{ marginTop: "24px" }}>Loading complaints...</p>}
        {error && <p style={{ marginTop: "24px", color: "#dc2626" }}>{error}</p>}
        {notice && <p style={{ marginTop: "24px", color: "#15803d" }}>{notice}</p>}

        {!loading && !error && (
          <div style={{ marginTop: "24px", display: "grid", gap: "16px" }}>
            {complaints.length ? (
              complaints.map((item) => (
                <div key={item._id || item.id} style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "18px", background: "#f8fafc" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                    <div>
                      <h3 style={{ margin: 0 }}>{item.title || item.complaint_number || "Untitled complaint"}</h3>
                      <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                        {item.complaint_number || "Complaint"} {item.location?.village ? `- ${item.location.village}` : ""}
                      </p>
                    </div>
                    <div style={{ color: "#475569", fontWeight: 700 }}>
                      {item.status || "open"}
                    </div>
                  </div>

                  <p style={{ marginTop: "14px", color: "#334155", lineHeight: 1.6 }}>
                    {item.description || "No description provided."}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginTop: "16px" }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase" }}>Category</div>
                      <div>{item.category || "N/A"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase" }}>Priority</div>
                      <div>{item.priority || "N/A"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase" }}>Location</div>
                      <div>{item.location?.ward_number || item.location?.village || "N/A"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase" }}>Created</div>
                      <div>{item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A"}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: "16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                    <label style={{ fontWeight: 600 }}>Update status</label>
                    <select
                      defaultValue={item.status || "open"}
                      onChange={handleStatusChange(item._id || item.id)}
                      disabled={savingId === (item._id || item.id)}
                      style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #cbd5e1", background: "#fff" }}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {savingId === (item._id || item.id) && <span style={{ color: "#64748b" }}>Saving...</span>}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#64748b" }}>No complaints found for your ward area.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
