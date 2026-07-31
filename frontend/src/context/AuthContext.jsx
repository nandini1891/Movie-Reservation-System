import { createContext, useContext, useEffect, useState } from "react";
import { getStoredSession, login, register, logout as logoutRequest } from "../api/auth.js";

const AuthContext = createContext(null);

const DEMO_ACCOUNTS = [
  { label: "Member — Alex Rivera", email: "alex.rivera@example.com", role: "member" },
  { label: "Admin — Nisha", email: "abc@gmail.com", role: "admin" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState(null); // null | "signin" | "register"

  // On mount, restore whatever session the backend/token store already has.
  useEffect(() => {
    getStoredSession()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function signIn({ email, password }) {
    const session = await login({ email, password });
    setUser(session);
    setAuthModal(null);
    return session;
  }

  async function signUp({ name, email, password, role }) {
    const session = await register({ name, email, password, role });
    setUser(session);
    setAuthModal(null);
    return session;
  }

  async function signOut() {
    await logoutRequest();
    setUser(null);
  }

  const value = {
    user,
    loading,
    isAdmin: user?.role === "admin",
    authModal,
    openSignIn: () => setAuthModal("signin"),
    openRegister: () => setAuthModal("register"),
    closeAuthModal: () => setAuthModal(null),
    signIn,
    signUp,
    signOut,
    demoAccounts: DEMO_ACCOUNTS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
