const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

const AUTH_STORAGE_KEY = "villagex.auth";

function isFormData(value) {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

function buildUrl(path, query) {
  const url = path.startsWith("http://") || path.startsWith("https://")
    ? new URL(path)
    : new URL(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`);

  if (query && typeof query === "object") {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null && item !== "") {
            url.searchParams.append(key, String(item));
          }
        });
        return;
      }
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

function extractErrorMessage(payload) {
  if (!payload) return "Something went wrong while contacting the backend.";
  if (typeof payload === "string") return payload;
  if (payload.message) return payload.message;
  if (payload.detail) return payload.detail;
  if (payload.error) return payload.error;

  const entries = Object.entries(payload);
  if (entries.length) {
    const [key, value] = entries[0];
    if (Array.isArray(value) && value.length) {
      return `${key}: ${value[0]}`;
    }
    if (typeof value === "string") {
      return `${key}: ${value}`;
    }
    if (value && typeof value === "object") {
      return `${key}: ${extractErrorMessage(value)}`;
    }
  }

  return "The backend returned an unexpected response.";
}

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredAuth(session) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function getToken() {
  return getStoredAuth()?.token || null;
}

async function request(path, { method = "GET", query, body, auth = true } = {}) {
  const headers = {
    Accept: "application/json",
  };

  const token = auth ? getToken() : null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const init = { method, headers };
  if (body !== undefined) {
    if (isFormData(body)) {
      init.body = body;
    } else {
      headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(body);
    }
  }

  const response = await fetch(buildUrl(path, query), init);
  const text = await response.text();
  let payload = {};
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    const message = extractErrorMessage(payload);
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export function resolveDashboardRoute(role) {
  if (role === "ward_member") return "/ward-dashboard";
  if (role === "citizen") return "/citizen-dashboard";
  return "/government-dashboard";
}

export async function loginUser(identifier, password) {
  return request("/api/auth/login/", {
    method: "POST",
    auth: false,
    body: { identifier, password },
  });
}

export async function registerCitizen(payload) {
  return request("/api/auth/register/", {
    method: "POST",
    auth: false,
    body: {
      ...payload,
      role: "citizen",
    },
  });
}

export async function logoutUser() {
  return request("/api/auth/logout/", {
    method: "POST",
    auth: true,
  });
}

export async function getCurrentUser() {
  return request("/api/auth/me/");
}

export async function listProjects(query = {}, auth = false) {
  return request("/api/projects/", {
    query,
    auth,
  });
}

export async function listComplaints(query = {}, auth = false) {
  return request("/api/complaints/", {
    query,
    auth,
  });
}

export async function createComplaint(payload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    formData.append(key, String(value));
  });

  return request("/api/complaints/", {
    method: "POST",
    body: formData,
  });
}

export async function getDashboardStats() {
  return request("/api/dashboard/stats/");
}

export async function getVillageDashboard(villageName, query = {}) {
  return request(`/api/villages/${encodeURIComponent(villageName)}/dashboard/`, {
    query,
    auth: false,
  });
}

export async function listVillageDashboards(query = {}) {
  return request("/api/villages/dashboard/", {
    query,
    auth: false,
  });
}

export function getListItems(response, key = "items") {
  return response?.data?.items ?? response?.data?.[key] ?? [];
}
