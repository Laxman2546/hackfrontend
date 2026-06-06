/**
 * VillageX — Global Theme & Design System
 * =========================================
 * Import this file in any page to get consistent
 * colors, fonts, and shared component utilities.
 *
 * Fonts:  Sora (headings) · DM Sans (body/UI)
 * Colors: Primary Green #16a34a · Accent Blue #2563eb · Navy #0f172a
 */

// ─── FONT IMPORT ─────────────────────────────────────────────────────────────
export const FONT_IMPORT =
  "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap";

// ─── CSS VARIABLES (inject once into :root via GlobalStyles or index.css) ────
export const CSS_VARIABLES = `
  :root {
    /* Brand Greens */
    --vx-green-50:  #f0fdf4;
    --vx-green-100: #dcfce7;
    --vx-green-200: #bbf7d0;
    --vx-green-300: #86efac;
    --vx-green-400: #4ade80;
    --vx-green-500: #22c55e;
    --vx-green-600: #16a34a;
    --vx-green-700: #15803d;
    --vx-green-800: #166534;

    /* Accent Blues */
    --vx-blue-50:  #eff6ff;
    --vx-blue-100: #dbeafe;
    --vx-blue-400: #60a5fa;
    --vx-blue-500: #3b82f6;
    --vx-blue-600: #2563eb;
    --vx-blue-700: #1d4ed8;

    /* Neutrals */
    --vx-slate-50:  #f8fafc;
    --vx-slate-100: #f1f5f9;
    --vx-slate-200: #e2e8f0;
    --vx-slate-300: #cbd5e1;
    --vx-slate-400: #94a3b8;
    --vx-slate-500: #64748b;
    --vx-slate-600: #475569;
    --vx-slate-700: #334155;
    --vx-slate-800: #1e293b;
    --vx-slate-900: #0f172a;

    /* Semantic */
    --vx-error:   #dc2626;
    --vx-warning: #d97706;
    --vx-success: #16a34a;

    /* Typography */
    --font-display: 'Sora', sans-serif;
    --font-body:    'DM Sans', sans-serif;

    /* Radius */
    --vx-radius-sm: 8px;
    --vx-radius-md: 12px;
    --vx-radius-lg: 16px;
    --vx-radius-xl: 20px;

    /* Shadows */
    --vx-shadow-card: 0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04);
    --vx-shadow-form: 0 16px 48px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04);
  }
`;

// ─── BASE RESET + GLOBAL STYLES ──────────────────────────────────────────────
export const BASE_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: var(--font-body);
    background: #ffffff;
    color: var(--vx-slate-800);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    line-height: 1.2;
    color: var(--vx-slate-900);
  }
  a { text-decoration: none; color: inherit; }
  button, input, select, textarea { font-family: var(--font-body); }
  img { max-width: 100%; display: block; }
`;

// ─── TAILWIND THEME EXTENSION ─────────────────────────────────────────────────
// Add to tailwind.config.js → theme.extend
export const TAILWIND_THEME = {
  extend: {
    fontFamily: {
      display: ["Sora", "sans-serif"],
      body: ["DM Sans", "sans-serif"],
    },
    colors: {
      green: {
        50: "#f0fdf4",
        100: "#dcfce7",
        200: "#bbf7d0",
        300: "#86efac",
        400: "#4ade80",
        500: "#22c55e",
        600: "#16a34a",
        700: "#15803d",
        800: "#166534",
      },
      blue: {
        50: "#eff6ff",
        100: "#dbeafe",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
      },
    },
    borderRadius: {
      DEFAULT: "8px",
      md: "12px",
      lg: "16px",
      xl: "20px",
      "2xl": "24px",
    },
    boxShadow: {
      card: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
      form: "0 16px 48px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)",
    },
  },
};

// ─── PORTAL TYPES ─────────────────────────────────────────────────────────────
// Sidebar color variants keyed by portal type
export const PORTAL_VARIANTS = {
  citizen: {
    sidebar: "linear-gradient(160deg, #16a34a 0%, #15803d 60%, #0f3d2e 100%)",
    accentDot: "#4ade80",
    btnClass: "btn-green",
  },
  government: {
    sidebar: "linear-gradient(160deg, #1e3a5f 0%, #0f2849 60%, #071a35 100%)",
    accentDot: "#60a5fa",
    btnClass: "btn-blue",
  },
  ward: {
    sidebar: "linear-gradient(160deg, #0f766e 0%, #0d5a53 60%, #07403a 100%)",
    accentDot: "#5eead4",
    btnClass: "btn-teal",
  },
};

// ─── SHARED TAILWIND COMPONENT CLASS STRINGS ─────────────────────────────────
export const cc = {
  // Navigation
  page: "vx-auth-page",
  nav: "vx-auth-nav",
  logo: "vx-auth-logo",
  logoIcon: "vx-auth-logo-icon",
  backBtn: "vx-auth-back-btn",

  // Buttons
  btnPrimary: "vx-btn-primary",
  btnBlue: "vx-btn-blue",
  btnTeal: "vx-btn-teal",
  btnOutline: "vx-btn-outline",

  // Form
  formInput: "vx-form-input",
  formInputBlue: "vx-form-input vx-form-input-blue",
  formInputErr: "vx-form-input-error",
  formLabel: "vx-form-label",
  formError: "vx-form-error",
  formGroup: "vx-form-group",
  selectInput: "vx-select-input",
  inputWrap: "vx-form-input-wrap",
  passwordToggle: "vx-form-password-toggle",
  required: "vx-form-required",
  passwordStrength: "vx-password-strength",
  passwordTrack: "vx-password-track",
  passwordBar: "vx-password-bar",
  passwordLabel: "vx-password-label",

  // Auth layout
  authLayout: "vx-auth-layout",
  authSidebar: "vx-auth-sidebar",
  authMain: "vx-auth-main",
  authCard: "vx-auth-card",
  authCardWide: "vx-auth-card vx-auth-card-wide",
  authForm: "vx-auth-form",
  authGrid2: "vx-auth-grid-2",
  sidebarBadge: "vx-auth-sidebar-badge",
  sidebarTitle: "vx-auth-sidebar-title",
  sidebarDesc: "vx-auth-sidebar-desc",
  featureList: "vx-auth-feature-list",
  featureItem: "vx-auth-feature-item",
  featDot: "vx-auth-feature-dot",
  sidebarFooter: "vx-auth-sidebar-footer",

  // Cards
  card: "vx-card",

  // Section
  sectionTag: "vx-section-tag",
  sectionTitle: "vx-section-title",
  sectionSub: "vx-section-sub",

  // Misc
  title: "vx-auth-title",
  subtitle: "vx-auth-subtitle",
  success: "vx-auth-success",
  footerText: "vx-auth-footer-text",
  authLink: "vx-auth-link",
  authLinkBlue: "vx-auth-link-blue",
  authRow: "vx-auth-row",
  checkboxLabel: "vx-auth-checkbox-label",
  checkbox: "vx-auth-checkbox",
  forgotLink: "vx-auth-forgot-link",
  authSwitchRow: "vx-auth-switch-row",
  authSwitchLink: "vx-auth-switch-link",
};

// ─── LOGO SVG ─────────────────────────────────────────────────────────────────
export const LOGO_SVG = `
<svg width="36" height="36" viewBox="0 0 36 36" fill="none">
  <rect width="36" height="36" rx="10" fill="url(#vx-grad)"/>
  <text x="18" y="24" font-family="Sora,sans-serif" font-size="16" font-weight="800"
        text-anchor="middle" fill="white">V</text>
  <defs>
    <linearGradient id="vx-grad" x1="0" y1="0" x2="36" y2="36">
      <stop stop-color="#22c55e"/>
      <stop offset="1" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
</svg>`;

/*
 * ─── HOW TO USE IN PAGES ───────────────────────────────────────────────────
 *
 * 1. In index.css (or a GlobalStyles component), inject:
 *      import { CSS_VARIABLES, BASE_STYLES } from './theme/theme';
 *      // paste CSS_VARIABLES + BASE_STYLES into your root stylesheet
 *
 * 2. In tailwind.config.js:
 *      import { TAILWIND_THEME } from './src/theme/theme';
 *      module.exports = { theme: TAILWIND_THEME, ... }
 *
 * 3. In any component:
 *      import { cc } from './theme/theme';
 *      <input className={cc.formInput} />
 *      <button className={cc.btnPrimary}>Submit</button>
 *
 * 4. Add Google Fonts link in index.html <head>:
 *      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap">
 */
