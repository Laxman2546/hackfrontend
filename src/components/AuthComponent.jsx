/**
 * VillageX - Shared Auth Components
 * ===================================
 * Reusable layout, nav, and form building blocks
 * for all authentication pages.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cc } from "../theme/theme";

export function NavBar({ showBack = true }) {
  const navigate = useNavigate();

  return (
    <nav className={cc.nav}>
      <div className={cc.logo}>
        <div className={cc.logoIcon}>V</div>
        VillageX
      </div>
      {showBack && (
        <button onClick={() => navigate("/")} className={cc.backBtn}>
          ← Back to Portal
        </button>
      )}
    </nav>
  );
}

export function AuthLayout({ sidebar, sidebarStyle, children, wide = false }) {
  return (
    <div className={cc.authLayout}>
      <aside className={cc.authSidebar} style={sidebarStyle}>
        <div>
          {sidebar.badge && (
            <span className={cc.sidebarBadge}>{sidebar.badge}</span>
          )}
          <h2 className={cc.sidebarTitle}>{sidebar.title}</h2>
          <p className={cc.sidebarDesc}>{sidebar.description}</p>
          <ul className={cc.featureList}>
            {sidebar.features.map((feat, i) => (
              <li key={i} className={cc.featureItem}>
                <span
                  className={cc.featDot}
                  style={{ background: sidebar.accentDot ?? "#4ade80" }}
                />
                {feat}
              </li>
            ))}
          </ul>
        </div>
        {sidebar.footer && (
          <div className={cc.sidebarFooter}>{sidebar.footer}</div>
        )}
      </aside>

      <main className={cc.authMain}>
        <div className={wide ? cc.authCardWide : cc.authCard}>{children}</div>
      </main>
    </div>
  );
}

export function FormInput({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  blue = false,
  required = false,
  children,
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword && show ? "text" : type;

  return (
    <div className={cc.formGroup}>
      <label htmlFor={id} className={cc.formLabel}>
        {label}
        {required && <span className={cc.required}>*</span>}
      </label>
      <div className={cc.inputWrap}>
        <input
          id={id}
          type={actualType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${blue ? cc.formInputBlue : cc.formInput} ${
            error ? cc.formInputErr : ""
          } ${isPassword ? "vx-form-input--password" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className={cc.passwordToggle}
            tabIndex={-1}
          >
            {show ? "🙈" : "👁"}
          </button>
        )}
      </div>
      {error && <p className={cc.formError}>{error}</p>}
      {children}
    </div>
  );
}

export function FormSelect({
  label,
  id,
  value,
  onChange,
  error,
  options,
  required = false,
}) {
  return (
    <div className={cc.formGroup}>
      <label htmlFor={id} className={cc.formLabel}>
        {label}
        {required && <span className={cc.required}>*</span>}
      </label>
      <div className={cc.inputWrap}>
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`${cc.selectInput} ${error ? cc.formInputErr : ""}`}
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")',
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
          }}
        >
          {options.map((opt) =>
            typeof opt === "string" ? (
              <option
                key={opt}
                value={opt === "— Select your village —" ? "" : opt}
              >
                {opt}
              </option>
            ) : (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ),
          )}
        </select>
      </div>
      {error && <p className={cc.formError}>{error}</p>}
    </div>
  );
}

export function PasswordStrengthBar({ password }) {
  const getStrength = (v) => {
    if (!v) return { label: "", color: "transparent", width: "0%" };

    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;

    const map = [
      { color: "#dc2626", width: "25%", label: "Weak" },
      { color: "#f97316", width: "50%", label: "Fair" },
      { color: "#eab308", width: "75%", label: "Good" },
      { color: "#16a34a", width: "100%", label: "Strong" },
    ];

    return map[score - 1] ?? {
      color: "#dc2626",
      width: "10%",
      label: "Too short",
    };
  };

  const { color, width, label } = getStrength(password);

  return (
    <div className={cc.passwordStrength}>
      <div className={cc.passwordTrack}>
        <div
          className={cc.passwordBar}
          style={{ width, background: color }}
        />
      </div>
      {password && (
        <p className={cc.passwordLabel} style={{ color }}>
          {label} password
        </p>
      )}
    </div>
  );
}
