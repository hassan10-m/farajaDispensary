import { request, setToken, clearToken, getToken } from "./client";

// Backend inatarajiwa kurudisha: { token, user: { id, username, role, ... } }
// Kama majina ya fields yako ni tofauti, badilisha hapa tu.
export async function login(username, password) {
  const data = await request("/auth/login", { method: "POST", body: { username, password }, auth: false });
  setToken(data.token);
  localStorage.setItem("dispensary_user", JSON.stringify(data.user));
  return data.user;
}

export async function register({ fullName, username, password, role }) {
  return request("/auth/register", {
    method: "POST",
    body: { fullName, username, password, role },
    auth: false,
  });
}

export function logout() {
  clearToken();
  localStorage.removeItem("dispensary_user");
}

export const isLoggedIn = () => !!getToken();

export function currentUser() {
  try { return JSON.parse(localStorage.getItem("dispensary_user")); } catch { return null; }
}
