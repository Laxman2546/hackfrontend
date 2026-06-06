/**
 * VillageX - Ward Member Login Page
 * ===================================
 * Route: /ward-login
 * Redirect on success: /ward-dashboard
 *
 * Notes:
 * - Accounts created by government admins; no self-registration
 * - Member ID or email accepted
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar, AuthLayout, FormInput } from "../components/AuthComponent";
import {
  loginUser,
  resolveDashboardRoute,
  setStoredAuth,
} from "../api/villageApi";
import { cc } from "../theme/theme";

const SIDEBAR = {
  badge: "Ward Portal",
  title: "Ward Member Access",
  description:
    "Login to manage your ward's development activities, update project progress, and engage with citizens.",
  features: [
    "Update project progress & milestones",
    "Upload development photos & reports",
    "Manage local activities & events",
    "Respond to citizen feedback",
    "Ward budget & expenditure view",
  ],
  accentDot: "#5eead4",
  footer: "VillageX Ward Portal · Gram Panchayat",
};

const SIDEBAR_STYLE = {
  background: "linear-gradient(160deg, #0f766e 0%, #0d5a53 60%, #07403a 100%)",
};

export default function WardLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.id.trim()) errs.id = "Please enter your Member ID or email";
    if (!form.password) errs.password = "Please enter your password";
    return errs;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const response = await loginUser(form.id.trim(), form.password);
      const token = response?.data?.access_token;
      const user = response?.data?.user;
      if (!token || !user) {
        throw new Error("Login succeeded but the backend response was incomplete.");
      }
      setStoredAuth({ token, user });
      setTimeout(() => navigate(resolveDashboardRoute(user.role)), 600);
    } catch (error) {
      setErrors({ form: error.message || "Unable to sign in right now." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cc.page}>
      <NavBar />
      <AuthLayout sidebar={SIDEBAR} sidebarStyle={SIDEBAR_STYLE}>
        <h2 className={cc.title}>Ward Member Login</h2>
        <p className={cc.subtitle}>
          Accounts are created by government administrators only.
        </p>

        {errors.form && <div className={cc.formError}>{errors.form}</div>}

        <form onSubmit={handleLogin} noValidate className={cc.authForm}>
          <FormInput
            label="Member ID / Email"
            id="ward-id"
            type="text"
            placeholder="WRD-0042 or member@ward.gov.in"
            value={form.id}
            onChange={set("id")}
            error={errors.id}
            required
          />

          <FormInput
            label="Password"
            id="ward-pass"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={set("password")}
            error={errors.password}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={cc.btnTeal}
          >
            {loading ? "Signing in..." : "Login to Ward Dashboard"}
          </button>
        </form>

        <p className={cc.footerText}>
          Issues accessing your account?{" "}
          <strong className={cc.authLinkBlue}>Contact your administrator</strong>
        </p>
      </AuthLayout>

      {/* Placeholder for Ward Dashboard links - In a real app, this would be on a separate dashboard page */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          type="button"
          className={cc.authSwitchLink}
          onClick={() => navigate("/ward/create-announcement")}
        >
          Create Announcement (Ward Dashboard)
        </button>
      </div>
    </div>
  );
}
