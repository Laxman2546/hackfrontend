import { useEffect, useState } from "react";
import {
  Building2,
  FolderKanban,
  IndianRupee,
  AlertCircle,
  Clock3,
  User,
  TrendingUp,
  Plus,
  FileText,
  Users,
  MapPin,
} from "lucide-react";
import { getDashboardStats, getStoredAuth, getListItems } from "../../api/villageApi";

export default function GovernmentDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  // Theme Variables
  const colors = {
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    bgHover: "#f8fafc",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    bg: "#f8fafc",
    card: "#ffffff",
    textMain: "#0f172a",
    textMuted: "#64748b",
    border: "#e2e8f0",
  };

  // Reusable Component Styles
  const cardStyle = {
    background: colors.card,
    borderRadius: "12px",
    padding: "20px",
    border: `1px solid ${colors.border}`,
    boxShadow:
      "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
  };

  const cardHeaderStyle = {
    paddingBottom: "16px",
    borderBottom: `1px solid #f1f5f9`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  };

  useEffect(() => {
    const session = getStoredAuth();
    if (!session?.token) {
      setLoading(false);
      return;
    }

    let active = true;
    getDashboardStats()
      .then((response) => {
        if (!active) return;
        setDashboard(response?.data || null);
      })
      .catch(() => {
        if (!active) return;
        setDashboard(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = [
    {
      title: "Total Villages",
      value: "24",
      icon: <Building2 size={20} style={{ color: "#2563eb" }} />,
      bg: "#eff6ff",
    },
    {
      title: "Active Projects",
      value: "58",
      icon: <FolderKanban size={20} style={{ color: "#059669" }} />,
      bg: "#ecfdf5",
    },
    {
      title: "Allocated Budget",
      value: "₹2.4 Cr",
      icon: <IndianRupee size={20} style={{ color: "#d97706" }} />,
      bg: "#fffbeb",
    },
    {
      title: "Pending Complaints",
      value: "12",
      icon: <AlertCircle size={20} style={{ color: "#e11d48" }} />,
      bg: "#fef2f2",
    },
  ];

  const actions = [
    { label: "Add Village", icon: <MapPin size={16} /> },
    { label: "Create Project", icon: <Plus size={16} /> },
    { label: "Allocate Budget", icon: <IndianRupee size={16} /> },
    { label: "Add Ward Member", icon: <Users size={16} /> },
    { label: "Generate Report", icon: <FileText size={16} /> },
  ];

  const projects = [
    {
      name: "Road Construction",
      village: "Rampur",
      progress: 75,
      status: "On Track",
    },
    {
      name: "Water Tank Installation",
      village: "Lakshmipur",
      progress: 45,
      status: "Delayed",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg,
        color: colors.textMain,
        fontFamily: "system-ui, -apple-system, sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Top Navigation */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          width: "100%",
          borderBottom: `1px solid ${colors.border}`,
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            display: "flex",
            height: "64px",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                height: "32px",
                width: "32px",
                borderRadius: "8px",
                background: colors.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              V
            </div>
            <span
              style={{
                fontSize: "20px",
                fontWeight: "700",
                letterSpacing: "-0.025em",
              }}
            >
              VillageX
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            <a
              href="#projects"
              style={{ color: colors.primary, textDecoration: "none" }}
            >
              Projects
            </a>
            <a
              href="#villages"
              style={{ color: colors.textMuted, textDecoration: "none" }}
            >
              Villages
            </a>
            <a
              href="#reports"
              style={{ color: colors.textMuted, textDecoration: "none" }}
            >
              Reports
            </a>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingLeft: "16px",
              borderLeft: `1px solid ${colors.border}`,
            }}
          >
            <button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#f1f5f9",
                border: "none",
                cursor: "pointer",
              }}
            >
              <User size={16} style={{ color: colors.textMuted }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Banner/Hero Section */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "16px",
            background: "linear-gradient(to right, #0f172a, #1e1b4b, #0f172a)",
            padding: "32px",
            border: "1px solid #1e293b",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{ position: "relative", zIndex: 10, maxWidth: "42rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                borderRadius: "9999px",
                background: "rgba(37, 99, 235, 0.1)",
                padding: "4px 12px",
                fontSize: "12px",
                fontWeight: "500",
                color: "#60a5fa",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                marginBottom: "16px",
              }}
            >
              <TrendingUp size={12} /> System Live
            </span>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#ffffff",
                letterSpacing: "-0.025em",
                marginBottom: "8px",
                marginTop: 0,
              }}
            >
              Administrative & Development Console
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#cbd5e1",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              Consolidated real-time operational window overseeing multi-village
              structural infrastructure deployments, active regional capital
              flow metrics, and localized civic grievance tickets.
            </p>
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              marginTop: "-16px",
              marginRight: "-16px",
              width: "224px",
              height: "224px",
              background: "rgba(37, 99, 235, 0.1)",
              borderRadius: "50%",
              filter: "blur(48px)",
              pointerEvents: "none",
            }}
          />
        </div>

        {loading && <div style={cardStyle}>Loading dashboard summary...</div>}

        {dashboard && (
          <div
            style={{
              ...cardStyle,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            <SummaryPill
              label="Live Villages"
              value={dashboard?.reports_overview?.total_villages ?? 0}
            />
            <SummaryPill
              label="Live Projects"
              value={dashboard?.reports_overview?.total_projects ?? 0}
            />
            <SummaryPill
              label="Open Complaints"
              value={dashboard?.complaints?.by_status?.open ?? 0}
            />
            <SummaryPill
              label="Recent Projects"
              value={(dashboard?.recent_projects || []).length}
            />
          </div>
        )}

        {/* Metric Metrics Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
          }}
        >
          {stats.map((item) => (
            <div
              key={item.title}
              style={{
                ...cardStyle,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                    color: colors.textMuted,
                    display: "block",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  {item.title}
                </span>
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: colors.textMain,
                    display: "block",
                  }}
                >
                  {item.value}
                </span>
              </div>
              <div
                style={{
                  padding: "12px",
                  borderRadius: "12px",
                  background: item.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Component */}
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: colors.textMain,
              margin: "0 0 16px 0",
            }}
          >
            Quick Actions
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {actions.map((action, index) => (
              <button
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#ffffff",
                  color: colors.textMain,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  padding: "10px 16px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.bgHover;
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.borderColor = colors.border;
                }}
              >
                <span
                  style={{
                    color: colors.primary,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {action.icon}
                </span>
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Split Section Split */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Main Area (Left Column Side) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              gridColumn: "span 2",
            }}
          >
            {/* Infrastructures Card */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div>
                  <h3
                    style={{ fontWeight: "600", fontSize: "16px", margin: 0 }}
                  >
                    Active Capital Infrastructures
                  </h3>
                  <p
                    style={{
                      fontSize: "12px",
                      color: colors.textMuted,
                      margin: "4px 0 0 0",
                    }}
                  >
                    Live target progress of active heavy development operations
                  </p>
                </div>
                <button
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: colors.primary,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  View All
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {projects.map((project, idx) => (
                  <div
                    key={project.name}
                      style={{
                        padding: "16px 0",
                        borderBottom:
                          idx === projects.length - 1
                            ? "none"
                            : `1px solid #f1f5f9`,
                      }}
                    >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "8px",
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            margin: 0,
                          }}
                        >
                          {project.name}
                        </h4>
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: "12px",
                            fontWeight: "500",
                            color: colors.textMuted,
                            marginTop: "2px",
                          }}
                        >
                          {project.village} Ward Territory
                        </span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "700",
                          }}
                        >
                          {project.progress}%
                        </span>
                        <span
                          style={{
                            display: "block",
                            fontSize: "10px",
                            fontWeight: "600",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            marginTop: "2px",
                            color:
                              project.status === "On Track"
                                ? colors.success
                                : colors.warning,
                          }}
                        >
                          {project.status}
                        </span>
                      </div>
                    </div>
                    {/* Custom CSS Progress Slider */}
                    <div
                      style={{
                        width: "100%",
                        background: "#f1f5f9",
                        height: "8px",
                        borderRadius: "9999px",
                        overflow: "hidden",
                        marginTop: "12px",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          borderRadius: "9999px",
                          transition: "all 0.5s ease",
                          width: `${project.progress}%`,
                          background:
                            project.status === "On Track"
                              ? colors.success
                              : colors.warning,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Logs Component */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div>
                  <h3
                    style={{ fontWeight: "600", fontSize: "16px", margin: 0 }}
                  >
                    System Activity Stream
                  </h3>
                  <p
                    style={{
                      fontSize: "12px",
                      color: colors.textMuted,
                      margin: "4px 0 0 0",
                    }}
                  >
                    Chronological transaction logs recorded by nodes
                  </p>
                </div>
              </div>
              <div>
                <div
                  style={{
                    position: "relative",
                    borderLeft: `2px solid #f1f5f9`,
                    paddingLeft: "16px",
                    marginLeft: "4px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {[
                    {
                      text: "Road project status state delta modified by Ward Member",
                      time: "10 mins ago",
                    },
                    {
                      text: "New programmatic budget assigned for Water Infrastructure Phase II",
                      time: "2 hours ago",
                    },
                    {
                      text: "Citizen grievance ticket #8401 labeled as resolved status",
                      time: "1 day ago",
                    },
                    {
                      text: "Automated aggregate consolidated village report compiled",
                      time: "2 days ago",
                    },
                  ].map((activity, index) => (
                    <div key={index} style={{ position: "relative" }}>
                      {/* Timeline Node Dot */}
                      <div
                        style={{
                          position: "absolute",
                          left: "-21px",
                          top: "4px",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#cbd5e1",
                          border: "4px solid #ffffff",
                          boxShadow: "0 0 0 1px #cbd5e1",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#334155",
                            margin: 0,
                          }}
                        >
                          {activity.text}
                        </p>
                        <span
                          style={{
                            fontSize: "12px",
                            color: colors.textMuted,
                            whiteSpace: "nowrap",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Clock3 size={12} /> {activity.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area (Right Column Side) */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* Grievances Card */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div>
                  <h3
                    style={{ fontWeight: "600", fontSize: "16px", margin: 0 }}
                  >
                    Critical Grievances
                  </h3>
                  <p
                    style={{
                      fontSize: "12px",
                      color: colors.textMuted,
                      margin: "4px 0 0 0",
                    }}
                  >
                    Inbound civic problem filings requiring dispatch
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {[
                  { type: "Water Leakage", priority: "High" },
                  { type: "Broken Street Light", priority: "Medium" },
                  { type: "Garbage Collection Delay", priority: "Low" },
                ].map((item) => (
                  <div
                    key={item.type}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingBottom: "12px",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          padding: "6px",
                          background: "#fef2f2",
                          borderRadius: "8px",
                          display: "flex",
                        }}
                      >
                        <AlertCircle
                          size={16}
                          style={{ color: colors.danger }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#334155",
                        }}
                      >
                        {item.type}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 8px",
                        fontWeight: "600",
                        borderRadius: "9999px",
                        border: "1px solid",
                        backgroundColor:
                          item.priority === "High"
                            ? "#fef2f2"
                            : item.priority === "Medium"
                              ? "#fffbeb"
                              : "#f8fafc",
                        color:
                          item.priority === "High"
                            ? colors.danger
                            : item.priority === "Medium"
                              ? colors.warning
                              : colors.textMuted,
                        borderColor:
                          item.priority === "High"
                            ? "#fee2e2"
                            : item.priority === "Medium"
                              ? "#fef3c7"
                              : colors.border,
                      }}
                    >
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SummaryPill({ label, value }) {
  return (
    <div
      style={{
        padding: "14px",
        borderRadius: "14px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: "700",
          textTransform: "uppercase",
          color: "#64748b",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "22px", fontWeight: "800", marginTop: "8px" }}>
        {value}
      </div>
    </div>
  );
}
