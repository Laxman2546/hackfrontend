import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  clearStoredAuth,
  createComplaint,
  getCurrentUser,
  getListItems,
  getStoredAuth,
  listComplaints,
  logoutUser,
  setStoredAuth,
} from "../../api/villageApi";

const CATEGORY_OPTIONS = [
  "Road Issue",
  "Water Supply",
  "Street Lights",
  "Drainage",
  "Garbage Collection",
];

const PRIORITY_OPTIONS = ["low", "medium", "high", "critical"];

export default function ComplaintsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    category: "Road Issue",
    title: "",
    description: "",
    priority: "medium",
    village: "",
    ward_number: "",
    district: "",
    state: "",
    pincode: "",
    address_line1: "",
    address_line2: "",
    landmark: "",
    latitude: "",
    longitude: "",
  });

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

        setForm((current) => ({
          ...current,
          village: user?.village || current.village,
          ward_number: user?.ward_number || current.ward_number,
          district: user?.district || current.district,
          state: user?.state || current.state,
          pincode: user?.pincode || current.pincode,
          address_line1: user?.address_line1 || current.address_line1,
          address_line2: user?.address_line2 || current.address_line2,
        }));

        const complaintsResponse = await listComplaints({ mine: true, page_size: 10 }, true);
        if (!active) return;
        setComplaints(getListItems(complaintsResponse));
      } catch (err) {
        if (!active) return;
        setError(err.message || "Unable to load complaints.");
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
      // Stateless logout; clear locally either way.
    } finally {
      clearStoredAuth();
      navigate("/citizen-login");
    }
  };

  const setField = (key) => (e) => {
    setForm((current) => ({ ...current, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    setSubmitting(true);

    try {
      const payload = {
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        priority: form.priority,
        village: form.village.trim(),
        ward_number: form.ward_number.trim() || undefined,
        district: form.district.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        address_line1: form.address_line1.trim(),
        address_line2: form.address_line2.trim() || undefined,
        landmark: form.landmark.trim() || undefined,
        latitude: form.latitude.trim() || undefined,
        longitude: form.longitude.trim() || undefined,
      };

      await createComplaint(payload);
      setSubmitSuccess("Complaint submitted successfully.");
      setForm((current) => ({
        ...current,
        title: "",
        description: "",
        priority: "medium",
        landmark: "",
        latitude: "",
        longitude: "",
      }));

      const complaintsResponse = await listComplaints({ mine: true, page_size: 10 }, true);
      setComplaints(getListItems(complaintsResponse));
    } catch (err) {
      setSubmitError(err.message || "Unable to submit complaint.");
    } finally {
      setSubmitting(false);
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
          <h1 style={titleStyle}>Raise a Complaint</h1>
          <p style={{ color: "#64748b", marginTop: 0 }}>
            Submit a live complaint and track your own records from the backend.
          </p>

          {submitError && <div style={errorBanner}>{submitError}</div>}
          {submitSuccess && <div style={successBanner}>{submitSuccess}</div>}
          {error && <div style={errorBanner}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={grid2}>
              <Field
                label="Category"
                element={
                  <select value={form.category} onChange={setField("category")} style={input}>
                    {CATEGORY_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                }
              />
              <Field
                label="Priority"
                element={
                  <select value={form.priority} onChange={setField("priority")} style={input}>
                    {PRIORITY_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                }
              />
            </div>

            <Field
              label="Complaint Title"
              element={<input value={form.title} onChange={setField("title")} placeholder="Enter complaint title" style={input} />}
            />
            <Field
              label="Description"
              element={<textarea rows={5} value={form.description} onChange={setField("description")} placeholder="Describe your issue" style={input} />}
            />

            <div style={grid2}>
              <Field label="Village" element={<input value={form.village} onChange={setField("village")} style={input} />} />
              <Field label="Ward Number" element={<input value={form.ward_number} onChange={setField("ward_number")} style={input} />} />
            </div>

            <div style={grid2}>
              <Field label="District" element={<input value={form.district} onChange={setField("district")} style={input} />} />
              <Field label="State" element={<input value={form.state} onChange={setField("state")} style={input} />} />
            </div>

            <div style={grid2}>
              <Field label="Pincode" element={<input value={form.pincode} onChange={setField("pincode")} style={input} />} />
              <Field label="Address Line 1" element={<input value={form.address_line1} onChange={setField("address_line1")} style={input} />} />
            </div>

            <div style={grid2}>
              <Field label="Address Line 2" element={<input value={form.address_line2} onChange={setField("address_line2")} style={input} />} />
              <Field label="Landmark" element={<input value={form.landmark} onChange={setField("landmark")} style={input} />} />
            </div>

            <div style={grid2}>
              <Field label="Latitude" element={<input value={form.latitude} onChange={setField("latitude")} style={input} />} />
              <Field label="Longitude" element={<input value={form.longitude} onChange={setField("longitude")} style={input} />} />
            </div>

            <button type="submit" disabled={submitting} style={submitButton}>
              {submitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </section>

        <section style={{ ...card, marginTop: "24px" }}>
          <h2 style={titleStyle}>My Complaints</h2>
          {loading ? (
            <p>Loading complaints...</p>
          ) : complaints.length ? (
            complaints.map((item, index) => (
              <div
                key={item._id || item.id || index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 0",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <div>
                  <h4 style={{ margin: 0 }}>{item.title || item.complaint_number || "Untitled complaint"}</h4>
                  <p style={{ margin: "4px 0 0", color: "#64748b" }}>
                    {item.category || "General"} {item.location?.village ? `- ${item.location.village}` : ""}
                  </p>
                </div>
                <span style={statusBadge(item.status)}>{item.status || "open"}</span>
              </div>
            ))
          ) : (
            <p>No complaints found for your account.</p>
          )}
        </section>
      </main>
    </div>
  );
}

function Field({ label, element }) {
  return (
    <label style={{ display: "block", marginBottom: "16px" }}>
      <span style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>{label}</span>
      {element}
    </label>
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

const input = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  marginTop: "8px",
  fontSize: "15px",
  boxSizing: "border-box",
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px",
};

const submitButton = {
  marginTop: "8px",
  background: "var(--vx-green-600)",
  color: "#fff",
  border: "none",
  padding: "12px 24px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 700,
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

const successBanner = {
  marginBottom: "16px",
  padding: "12px 14px",
  borderRadius: "10px",
  background: "#f0fdf4",
  color: "#166534",
  border: "1px solid #bbf7d0",
};

function statusBadge(status) {
  const resolved = String(status).toLowerCase() === "resolved";
  return {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    background: resolved ? "var(--vx-green-100)" : "var(--vx-blue-100)",
    color: resolved ? "var(--vx-green-700)" : "var(--vx-blue-700)",
  };
}
