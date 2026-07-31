import { client, setAuthToken, getAuthToken } from "./client.js";
import { mockUsers } from "./mockData.js";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";
const SESSION_KEY = "cinevault_session";

/**
 * BACKEND CONTRACT
 * -----------------
 * POST /auth/login      { email, password }              -> { token, user: { id, name, email, role } }
 * POST /auth/register   { name, email, password, role }   -> { token, user: { id, name, email, role } }
 * GET  /auth/me         (auth header)                     -> { id, name, email, role }
 * POST /auth/logout     (auth header)                     -> 204
 *
 * NOTE: The mock layer below stores password in plaintext in memory purely
 * to simulate a match/mismatch for the demo UI. The real backend must hash
 * passwords (e.g. bcrypt) — never send/store plaintext in production.
 */

export async function login({ email, password }) {
  if (USE_MOCKS) {
    const existing = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing && existing.password !== undefined && existing.password !== password) {
      throw { response: { data: { message: "Incorrect email or password." } } };
    }

    const user = existing || {
      id: `u${Date.now()}`,
      name: email.split("@")[0],
      email,
      role: "member",
      password,
    };
    const fakeToken = `mock-token-${user.id}`;
    setAuthToken(fakeToken);
    const { password: _omit, ...safeUser } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    return safeUser;
  }

  const { data } = await client.post("/auth/login", { email, password });
  setAuthToken(data.token);
  return data.user;
}

export async function register({ name, email, password, role }) {
  if (USE_MOCKS) {
    if (mockUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw { response: { data: { message: "An account with this email already exists." } } };
    }
    const user = { id: `u${Date.now()}`, name, email, role, password };
    mockUsers.push(user);
    const fakeToken = `mock-token-${user.id}`;
    setAuthToken(fakeToken);
    const { password: _omit, ...safeUser } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    return safeUser;
  }

  const { data } = await client.post("/auth/register", { name, email, password, role });
  setAuthToken(data.token);
  return data.user;
}

export async function logout() {
  if (USE_MOCKS) {
    setAuthToken(null);
    localStorage.removeItem(SESSION_KEY);
    return;
  }

  await client.post("/auth/logout");
  setAuthToken(null);
}

export async function getStoredSession() {
  if (!getAuthToken()) return null;

  if (USE_MOCKS) {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  const { data } = await client.get("/auth/me");
  return data;
}
