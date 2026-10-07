// Mahali pamoja pa kuita backend. Kila ombi hubeba JWT token kiotomatiki.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const TOKEN_KEY = "dispensary_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Hakuna mawasiliano na server. Hakikisha backend inafanya kazi.");
  }

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    // Token imeisha / si sahihi: mtoe mtumiaji
    if (res.status === 401 && auth) {
      clearToken();
      if (window.location.pathname !== "/login") window.location.assign("/login");
    }
    throw new ApiError(res.status, (data && (data.message || data.error)) || `Kosa ${res.status}`, data);
  }
  return data;
}

function safeJson(text) {
  try { return JSON.parse(text); } catch { return text; }
}

// Kiwanda cha CRUD: /patients, /medicines, n.k.
export function makeResource(base) {
  return {
    list: () => request(base),
    get: (id) => request(`${base}/${id}`),
    create: (payload) => request(base, { method: "POST", body: payload }),
    update: (id, payload) => request(`${base}/${id}`, { method: "PUT", body: payload }),
    remove: (id) => request(`${base}/${id}`, { method: "DELETE" }),
  };
}
