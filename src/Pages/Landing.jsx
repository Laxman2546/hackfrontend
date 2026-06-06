import { useState } from "react";
import "../styles/Landing.css";
import { useNavigate } from "react-router-dom";
const features = [
  {
    icon: "📋",
    color: "#dcfce7",
    title: "Project Management",
    desc: "Create, organize, and monitor development projects across villages with structured workflows and clear ownership.",
  },
  {
    icon: "💰",
    color: "#dbeafe",
    title: "Budget Tracking",
    desc: "Manage project budgets and track expenditure throughout the project lifecycle with real-time visibility.",
  },
  {
    icon: "📊",
    color: "#fef9c3",
    title: "Progress Monitoring",
    desc: "Update and view project completion status with visual progress indicators and milestone tracking.",
  },
  {
    icon: "🗺️",
    color: "#ede9fe",
    title: "Village Dashboard",
    desc: "Access village-wise development information from a centralized, easy-to-navigate dashboard.",
  },
  {
    icon: "💬",
    color: "#fce7f3",
    title: "Citizen Feedback",
    desc: "Collect suggestions, complaints, and feedback directly from citizens and key stakeholders.",
  },
  {
    icon: "📈",
    color: "#dcfce7",
    title: "Reports & Analytics",
    desc: "Generate detailed reports and visualize project performance through interactive charts and graphs.",
  },
];

const steps = [
  {
    n: "1",
    title: "Create Development Projects",
    desc: "Officials add and manage village development initiatives with all required details.",
  },
  {
    n: "2",
    title: "Allocate Resources",
    desc: "Assign budgets and human resources to each project efficiently.",
  },
  {
    n: "3",
    title: "Track Progress",
    desc: "Monitor project milestones and completion status in real time.",
  },
  {
    n: "4",
    title: "Collect Feedback",
    desc: "Receive input from citizens and stakeholders throughout execution.",
  },
  {
    n: "5",
    title: "Analyze Results",
    desc: "Generate reports and evaluate project outcomes for better planning.",
  },
];

const benefits = [
  {
    icon: "🔍",
    title: "Improve Transparency",
    desc: "Keep project information accessible and organized for all stakeholders at every level.",
  },
  {
    icon: "💳",
    title: "Better Budget Control",
    desc: "Monitor expenditures and resource allocation efficiently to prevent overruns.",
  },
  {
    icon: "⚡",
    title: "Faster Decision Making",
    desc: "Access project updates and reports in one place for timely, informed decisions.",
  },
  {
    icon: "✅",
    title: "Enhanced Accountability",
    desc: "Track progress and ensure development goals are achieved with clear audit trails.",
  },
];

const DashboardMock = () => (
  <div className="vx-dashboard-mock">
    <div className="vx-db-header">
      <div className="vx-db-header-dots">
        <span style={{ background: "#ff5f57" }} />
        <span style={{ background: "#febc2e" }} />
        <span style={{ background: "#28c840" }} />
      </div>
      <div className="vx-db-header-title">VillageX Dashboard</div>
      <div style={{ width: 54 }} />
    </div>
    <div className="vx-db-body">
      <div className="vx-db-row">
        <div className="vx-db-card">
          <div className="vx-db-card-label">Active Projects</div>
          <div className="vx-db-card-val">24</div>
          <div className="vx-db-card-sub green">↑ 3 this month</div>
        </div>
        <div className="vx-db-card">
          <div className="vx-db-card-label">Budget Utilized</div>
          <div className="vx-db-card-val">68%</div>
          <div className="vx-db-card-sub blue">On track</div>
        </div>
        <div className="vx-db-card">
          <div className="vx-db-card-label">Pending Review</div>
          <div className="vx-db-card-val">7</div>
          <div className="vx-db-card-sub orange">Needs action</div>
        </div>
      </div>
      <div className="vx-db-main">
        <div className="vx-db-projects">
          <div className="vx-db-projects-title">Project Progress</div>
          {[
            { name: "Road Repair – Ward 3", pct: 82, color: "#22c55e" },
            { name: "Water Supply – Phase 2", pct: 61, color: "#3b82f6" },
            { name: "School Renovation", pct: 45, color: "#f59e0b" },
            { name: "Solar Street Lights", pct: 90, color: "#22c55e" },
          ].map((p, i) => (
            <div className="vx-proj-row" key={i}>
              <div className="vx-proj-dot" style={{ background: p.color }} />
              <div className="vx-proj-name">{p.name}</div>
              <div className="vx-proj-bar-wrap">
                <div
                  className="vx-proj-bar"
                  style={{ width: `${p.pct}%`, background: p.color }}
                />
              </div>
              <div className="vx-proj-pct">{p.pct}%</div>
            </div>
          ))}
        </div>
        <div className="vx-db-budget">
          <div className="vx-budget-title">Budget Split</div>
          <div className="vx-budget-ring">
            <svg viewBox="0 0 80 80" width="80" height="80">
              <circle
                cx="40"
                cy="40"
                r="30"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="14"
              />
              <circle
                cx="40"
                cy="40"
                r="30"
                fill="none"
                stroke="#22c55e"
                strokeWidth="14"
                strokeDasharray={`${2 * Math.PI * 30 * 0.45} ${2 * Math.PI * 30 * 0.55}`}
                strokeDashoffset={2 * Math.PI * 30 * 0.25}
                strokeLinecap="round"
              />
              <circle
                cx="40"
                cy="40"
                r="30"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="14"
                strokeDasharray={`${2 * Math.PI * 30 * 0.3} ${2 * Math.PI * 30 * 0.7}`}
                strokeDashoffset={-2 * Math.PI * 30 * 0.2}
                strokeLinecap="round"
              />
              <circle
                cx="40"
                cy="40"
                r="30"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="14"
                strokeDasharray={`${2 * Math.PI * 30 * 0.25} ${2 * Math.PI * 30 * 0.75}`}
                strokeDashoffset={-2 * Math.PI * 30 * 0.5}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="vx-budget-legend">
            {[
              { color: "#22c55e", label: "Infrastructure 45%" },
              { color: "#3b82f6", label: "Education 30%" },
              { color: "#f59e0b", label: "Utilities 25%" },
            ].map((l, i) => (
              <div className="vx-legend-item" key={i}>
                <div
                  className="vx-legend-dot"
                  style={{ background: l.color }}
                />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function VillageX() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="vx-page">
        {/* NAV */}
        <nav className="vx-nav">
          <a href="#" className="vx-logo">
            <div className="vx-logo-icon">V</div>
            Village<span>X</span>
          </a>
          <ul className="vx-nav-links">
            {["Features", "How It Works", "Roles", "Benefits"].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase().replace(/ /g, "-")}`}>{l}</a>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              className="vx-nav-cta"
              onClick={() => navigate("/citizen-login")}
            >
              Login
            </button>
            <button
              className="vx-nav-cta"
              onClick={() => navigate("/citizen-register")}
            >
              Register
            </button>
          </div>
          <button
            className="vx-hamburger"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </nav>

        {/* HERO */}
        <section className="vx-hero">
          <div className="vx-hero-content">
            <div className="vx-hero-badge">Village Development Monitoring</div>
            <h1>
              Monitor Village Development with{" "}
              <em>Transparency and Efficiency</em>
            </h1>
            <p>
              Track development projects, manage budgets, monitor progress, and
              improve accountability through a centralized platform built for
              government and village administration.
            </p>
            <div className="vx-hero-btns">
              <button className="vx-btn-primary">
                Explore Features <span>→</span>
              </button>
              <button className="vx-btn-secondary">
                <span>▶</span> View Dashboard
              </button>
            </div>
          </div>
          <DashboardMock />
        </section>

        {/* FEATURES */}
        <section className="vx-section" id="features">
          <div className="vx-container">
            <div className="vx-section-head centered">
              <div className="vx-section-tag">Platform Features</div>
              <h2 className="vx-section-title">
                Everything You Need to Manage Village Development
              </h2>
              <p className="vx-section-sub">
                A comprehensive suite of tools designed to bring clarity and
                control to every stage of development project management.
              </p>
            </div>
            <div className="vx-features-grid">
              {features.map((f, i) => (
                <div className="vx-feature-card" key={i}>
                  <div className="vx-feat-icon" style={{ background: f.color }}>
                    {f.icon}
                  </div>
                  <div className="vx-feat-title">{f.title}</div>
                  <div className="vx-feat-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="vx-section vx-how" id="how-it-works">
          <div className="vx-container">
            <div className="vx-section-head centered">
              <div className="vx-section-tag">How It Works</div>
              <h2 className="vx-section-title">
                A Simple, Structured Workflow
              </h2>
              <p className="vx-section-sub">
                From project creation to outcome analysis — a clear five-step
                process that keeps every stakeholder aligned.
              </p>
            </div>
            <div className="vx-steps">
              {steps.map((s, i) => (
                <div className="vx-step" key={i}>
                  <div className="vx-step-num">{s.n}</div>
                  <div className="vx-step-title">{s.title}</div>
                  <div className="vx-step-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROLES */}
        <section className="vx-section" id="roles">
          <div className="vx-container">
            <div className="vx-section-head centered">
              <div className="vx-section-tag">User Roles</div>
              <h2 className="vx-section-title">
                Designed for Every Stakeholder
              </h2>
              <p className="vx-section-sub">
                Each role has tailored access and capabilities to ensure
                efficient collaboration across the governance hierarchy.
              </p>
            </div>
            <div className="vx-roles-grid">
              <div className="vx-role-card gov">
                <div className="vx-role-emoji">🏛️</div>
                <div className="vx-role-title">Government Officials</div>
                <div className="vx-role-desc">
                  Oversee all village projects, manage budgets, review reports,
                  and ensure development activities are on track across regions.
                </div>
                <div className="vx-role-tags">
                  <span className="vx-role-tag">Project Oversight</span>
                  <span className="vx-role-tag">Budget Approval</span>
                  <span className="vx-role-tag">Analytics</span>
                  <span className="vx-role-tag">Reports</span>
                </div>
              </div>
              <div className="vx-role-card admin">
                <div className="vx-role-emoji">🏘️</div>
                <div className="vx-role-title">Village Administrators</div>
                <div className="vx-role-desc">
                  Update project progress, manage local initiatives, coordinate
                  resources, and communicate status to higher authorities.
                </div>
                <div className="vx-role-tags">
                  <span className="vx-role-tag">Progress Updates</span>
                  <span className="vx-role-tag">Local Projects</span>
                  <span className="vx-role-tag">Resource Mgmt</span>
                </div>
              </div>
              <div className="vx-role-card citizen">
                <div className="vx-role-emoji">👥</div>
                <div className="vx-role-title">Citizens</div>
                <div className="vx-role-desc">
                  Stay informed about development projects in your village and
                  submit feedback, complaints, or suggestions to administrators.
                </div>
                <div className="vx-role-tags">
                  <span className="vx-role-tag">View Projects</span>
                  <span className="vx-role-tag">Submit Feedback</span>
                  <span className="vx-role-tag">Track Status</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="vx-section vx-benefits" id="benefits">
          <div className="vx-container">
            <div className="vx-section-head">
              <div className="vx-section-tag">Key Benefits</div>
              <h2 className="vx-section-title">
                Why VillageX Makes a Difference
              </h2>
              <p className="vx-section-sub">
                Purpose-built for public administration — driving
                accountability, efficiency, and transparency at every level.
              </p>
            </div>
            <div className="vx-benefits-grid">
              {benefits.map((b, i) => (
                <div className="vx-benefit-item" key={i}>
                  <div className="vx-benefit-icon">{b.icon}</div>
                  <div>
                    <div className="vx-benefit-title">{b.title}</div>
                    <div className="vx-benefit-desc">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="vx-cta">
          <div className="vx-cta-inner">
            <h2>
              Empowering Villages Through <em>Better Project Monitoring</em>
            </h2>
            <p>
              Join government departments and village administrations using
              VillageX to bring transparency, efficiency, and accountability to
              rural development.
            </p>
            <button className="vx-btn-cta">
              Get Started <span>→</span>
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="vx-footer">
          <div className="vx-footer-inner">
            <div className="vx-footer-logo">
              <div className="vx-logo-icon">V</div>
              VillageX
            </div>
            <ul className="vx-footer-links">
              {["Home", "Features", "Dashboard", "Reports", "Contact"].map(
                (l) => (
                  <li key={l}>
                    <a href="#">{l}</a>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="vx-footer-bottom">
            <p>
              © 2026 VillageX – Village Development Monitoring System. Built for
              transparent governance by team VillageX.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
