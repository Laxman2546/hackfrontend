/**
 * VillageX - Citizen Registration Page
 * =======================================
 * Route: /register
 * Redirect on success: /citizen-dashboard
 *
 * Fields: Full Name, Mobile, Email, Village, Password, Confirm Password
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  NavBar,
  AuthLayout,
  FormInput,
  FormSelect,
  PasswordStrengthBar,
} from "../components/AuthComponent";
import { registerCitizen } from "../api/villageApi";
import { cc } from "../theme/theme";

const SIDEBAR = {
  badge: "New Citizen",
  title: "Join VillageX Today",
  description:
    "Register to participate in your village's development journey and make your voice heard.",
  features: [
    "Free to register - takes 2 minutes",
    "Track projects in your village",
    "Submit complaints & feedback",
    "Receive official notifications",
    "Participate in village surveys",
  ],
  accentDot: "#4ade80",
  footer: null,
};

const SIDEBAR_STYLE = {
  background: "linear-gradient(160deg, #16a34a 0%, #15803d 60%, #0f3d2e 100%)",
};

const ID_TYPES = [
  { value: "", label: "Select ID type" },
  { value: "aadhaar", label: "Aadhaar" },
  { value: "voter_id", label: "Voter ID" },
  { value: "pan", label: "PAN" },
  { value: "driving_license", label: "Driving License" },
  { value: "passport", label: "Passport" },
  { value: "ration_card", label: "Ration Card" },
  { value: "other", label: "Other" },
];

const VILLAGES = [
  { value: "", label: "— Select your village —" },
  "Anandpur",
  "Belagaon",
  "Chintapur",
  "Dharmapur",
  "Eknath Nagar",
  "Fatehpur",
  "Ganapuram",
  "Harishpur",
  "Indrapur",
  "Janakpur",
  "Kalyani",
  "Laxmipur",
  "Mangalpur",
  "Nandanpur",
  "Omkareshwar",
].map((v) => (typeof v === "string" ? { value: v, label: v } : v));

export default function CitizenRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    village: "",
    district: "",
    state: "",
    pincode: "",
    address1: "",
    address2: "",
    idType: "",
    idNumber: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your full name";
    if (!/^\d{10}$/.test(form.mobile.trim()))
      errs.mobile = "Enter a valid 10-digit mobile number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = "Please enter a valid email address";
    if (!form.village) errs.village = "Please select your village";
    if (!form.district.trim()) errs.district = "District is required";
    if (!form.state.trim()) errs.state = "State is required";
    if (!/^\d{6}$/.test(form.pincode.trim()))
      errs.pincode = "Enter a valid 6-digit pincode";
    if (!form.address1.trim()) errs.address1 = "Address line 1 is required";
    if (!form.idType) errs.idType = "Please select a government ID type";
    if (!form.idNumber.trim()) errs.idNumber = "Government ID number is required";
    if (form.password.length < 8)
      errs.password = "Password must be at least 8 characters";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await registerCitizen({
        full_name: form.name.trim(),
        mobile_number: form.mobile.trim(),
        email: form.email.trim(),
        village: form.village,
        district: form.district.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        address_line1: form.address1.trim(),
        address_line2: form.address2.trim() || undefined,
        government_id_type: form.idType,
        government_id_number: form.idNumber.trim(),
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/citizen-login"), 1000);
    } catch (error) {
      setErrors({ form: error.message || "Unable to register right now." });
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
              Already registered?{" "}
              <span
                onClick={() => navigate("/citizen-login")}
                className={cc.authLink}
              >
                Sign in →
              </span>
            </span>
          ),
        }}
        sidebarStyle={SIDEBAR_STYLE}
        wide
      >
        <h2 className={cc.title}>Citizen Registration</h2>
        <p className={cc.subtitle}>
          Create your free account to access village development services.
        </p>

        {errors.form && <div className={cc.formError}>{errors.form}</div>}

        {success && (
          <div className={cc.success}>
            ✅ Registration successful! Redirecting to your dashboard...
          </div>
        )}

        <form onSubmit={handleRegister} noValidate className={cc.authForm}>
          <div className={cc.authGrid2}>
            <FormInput
              label="Full Name"
              id="reg-name"
              placeholder="Ramesh Kumar"
              value={form.name}
              onChange={set("name")}
              error={errors.name}
              required
            />
            <FormInput
              label="Mobile Number"
              id="reg-mobile"
              type="tel"
              placeholder="9876543210"
              value={form.mobile}
              onChange={set("mobile")}
              error={errors.mobile}
              required
            />
          </div>

          <FormInput
            label="Email Address"
            id="reg-email"
            type="email"
            placeholder="ramesh@example.com"
            value={form.email}
            onChange={set("email")}
            error={errors.email}
            required
          />

          <FormSelect
            label="Village"
            id="reg-village"
            value={form.village}
            onChange={set("village")}
            error={errors.village}
            options={VILLAGES}
            required
          />

          <div className={cc.authGrid2}>
            <FormInput
              label="District"
              id="reg-district"
              placeholder="Nalgonda"
              value={form.district}
              onChange={set("district")}
              error={errors.district}
              required
            />
            <FormInput
              label="State"
              id="reg-state"
              placeholder="Telangana"
              value={form.state}
              onChange={set("state")}
              error={errors.state}
              required
            />
          </div>

          <div className={cc.authGrid2}>
            <FormInput
              label="Pincode"
              id="reg-pincode"
              placeholder="500001"
              value={form.pincode}
              onChange={set("pincode")}
              error={errors.pincode}
              required
            />
            <FormSelect
              label="Government ID Type"
              id="reg-idtype"
              value={form.idType}
              onChange={set("idType")}
              error={errors.idType}
              options={ID_TYPES}
              required
            />
          </div>

          <FormInput
            label="Government ID Number"
            id="reg-idnumber"
            placeholder="Enter your ID number"
            value={form.idNumber}
            onChange={set("idNumber")}
            error={errors.idNumber}
            required
          />

          <FormInput
            label="Address Line 1"
            id="reg-address1"
            placeholder="House no., street, landmark"
            value={form.address1}
            onChange={set("address1")}
            error={errors.address1}
            required
          />

          <FormInput
            label="Address Line 2"
            id="reg-address2"
            placeholder="Apartment, area, near..."
            value={form.address2}
            onChange={set("address2")}
          />

          <div className={cc.authGrid2}>
            <div className={cc.formGroup}>
              <label htmlFor="reg-pass" className={cc.formLabel}>
                Password <span className={cc.required}>*</span>
              </label>
              <FormInput
                id="reg-pass"
                type="password"
                placeholder="Min 8 characters"
                value={form.password}
                onChange={set("password")}
                error={errors.password}
              >
                <PasswordStrengthBar password={form.password} />
              </FormInput>
            </div>

            <FormInput
              label="Confirm Password"
              id="reg-confirm"
              type="password"
              placeholder="Repeat password"
              value={form.confirm}
              onChange={set("confirm")}
              error={errors.confirm}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className={cc.btnPrimary}
          >
            {loading ? "Creating your account..." : "Create My Account"}
          </button>
        </form>

        <p className={cc.footerText}>
          Already have an account?{" "}
          <strong
            className={cc.authLink}
            onClick={() => navigate("/citizen-login")}
          >
            Sign in here
          </strong>
        </p>
      </AuthLayout>
    </div>
  );
}
