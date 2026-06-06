/**
 * VillageX - Government Official Login Page
 * ==========================================
 * Route: /gov-login
 * Redirect on success: /admin-dashboard
 *
 * Notes:
 * - No self-registration; accounts managed by system admin
 * - Employee ID or official email accepted
 * - Remember Me (30 days), Forgot Password link
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
  badge: "Government Portal",
  title: "Official Admin Access",
  description:
    "Secure access for authorized government officials. Accounts are provisioned and managed by system administrators only.",
  features: [
    "Project management & oversight",
    "Budget allocation & tracking",
    "Reports & analytics dashboard",
    "User management (ward & citizens)",
    "Policy & compliance tools",
  ],
  accentDot: "#60a5fa",
  footer: "VillageX Gov Portal v2.1 · Secure Access",
};

const SIDEBAR_STYLE = {
  background: "linear-gradient(160deg, #1e3a5f 0%, #0f2849 60%, #071a35 100%)",
};

export default function GovLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const validate = () => {
    const errs = {};
    if (!form.id.trim())
      errs.id = "Please enter your Employee ID or official email";
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
        <h2 className={cc.title}>Government Login</h2>
        <p className={cc.subtitle}>
          Authorized personnel only. Contact your administrator for access.
        </p>

        {errors.form && <div className={cc.formError}>{errors.form}</div>}

        <form onSubmit={handleLogin} noValidate className={cc.authForm}>
          <FormInput
            label="Employee ID / Official Email"
            id="gov-id"
            type="text"
            placeholder="EMP-001 or official@gov.in"
            value={form.id}
            onChange={set("id")}
            error={errors.id}
            blue
            required
          />

          <FormInput
            label="Password"
            id="gov-pass"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={set("password")}
            error={errors.password}
            blue
            required
          />

          <div className={cc.authRow}>
            <label className={cc.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.remember}
                onChange={set("remember")}
                className={cc.checkbox}
              />
              Remember me for 30 days
            </label>
            <a href="#" className={cc.forgotLink}>
              Forgot password?
            </a>
          </div>

          <button type="submit" disabled={loading} className={cc.btnBlue}>
            {loading ? "Signing in..." : "Login to Admin Dashboard"}
          </button>
        </form>

        <p className={cc.footerText}>
          Don't have access?{" "}
          <strong className={cc.authLinkBlue}>
            Contact system administrator
          </strong>
        </p>
      </AuthLayout>
    </div>
  );
}
