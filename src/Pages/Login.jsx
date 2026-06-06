/**
 * VillageX - Citizen Login Page
 * =======================================
 * Route: /citizen-login
 * Redirect on success: /citizen-dashboard
 *
 * Fields: Email/Mobile, Password
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
  badge: "Welcome Back",
  title: "Sign In to VillageX",
  description:
    "Access your village dashboard, track projects, and stay informed about community developments.",
  features: [
    "Secure login with email",
    "Real-time project updates",
    "Submit and track complaints",
    "Receive important notifications",
    "Participate in community decisions",
  ],
  accentDot: "#4ade80",
  footer: null,
};

const SIDEBAR_STYLE = {
  background: "linear-gradient(160deg, #16a34a 0%, #15803d 60%, #0f3d2e 100%)",
};

export default function CitizenLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.identifier.trim())
      errs.identifier = "Please enter your email, username, or mobile number";
    if (form.password.length < 8)
      errs.password = "Password must be at least 8 characters";
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
      const response = await loginUser(form.identifier.trim(), form.password);
      const token = response?.data?.access_token;
      const user = response?.data?.user;

      if (!token || !user) {
        throw new Error("Login succeeded but the backend response was incomplete.");
      }

      setStoredAuth({ token, user });
      setSuccess(true);
      const destination = resolveDashboardRoute(user.role);
      setTimeout(() => navigate(destination), 800);
    } catch (error) {
      setErrors({ form: error.message || "Unable to sign in right now." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cc.page}>
      <NavBar />
      <AuthLayout
        sidebar={{
          ...SIDEBAR,
          footer: (
            <span>
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/citizen-register")}
                className={cc.authLink}
              >
                Register →
              </span>
            </span>
          ),
        }}
        sidebarStyle={SIDEBAR_STYLE}
      >
        <h2 className={cc.title}>Citizen Login</h2>
        <p className={cc.subtitle}>Sign in to access your village dashboard and services.</p>

        {errors.form && <div className={cc.formError}>{errors.form}</div>}

        {success && (
          <div className={cc.success}>
            Login successful! Redirecting to your dashboard...
          </div>
        )}

        <form onSubmit={handleLogin} noValidate className={cc.authForm}>
          <FormInput
            label="Email / Username / Mobile"
            id="login-email"
            type="text"
            placeholder="ramesh@example.com"
            value={form.identifier}
            onChange={set("identifier")}
            error={errors.identifier}
            required
          />

          <FormInput
            label="Password"
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={set("password")}
            error={errors.password}
            required
          />

          <button
            type="submit"
            disabled={loading || success}
            className={cc.btnPrimary}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className={cc.footerText}>
          Don't have an account?{" "}
          <strong
            className={cc.authLink}
            onClick={() => navigate("/citizen-register")}
          >
            Register here
          </strong>
        </p>

        <div className={cc.authSwitchRow}>
          <button
            type="button"
            className={cc.authSwitchLink}
            onClick={() => navigate("/gov-login")}
          >
            Government Login
          </button>
          <button
            type="button"
            className={cc.authSwitchLink}
            onClick={() => navigate("/ward-login")}
          >
            Ward Login
          </button>
        </div>
      </AuthLayout>
    </div>
  );
}
