import { useState } from "react";
import Modal from "./common/Modal.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthModal() {
  const { authModal, closeAuthModal, openSignIn, openRegister, signIn, signUp, demoAccounts } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("member");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!authModal) return null;
  const isSignIn = authModal === "signin";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isSignIn && password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (!isSignIn && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      if (isSignIn) {
        await signIn({ email, password });
      } else {
        await signUp({ name, email, password, role });
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function autofill(account) {
    setEmail(account.email);
  }

  return (
    <Modal title={isSignIn ? "Sign In" : "Create Account"} onClose={closeAuthModal}>
      <div className="mb-5 flex rounded-md border border-ink-600 p-1">
        <button
          className={`flex-1 rounded py-1.5 text-sm font-medium transition-colors ${
            isSignIn ? "bg-gold-500 text-ink-950" : "text-muted hover:text-ivory"
          }`}
          onClick={openSignIn}
          type="button"
        >
          Sign In
        </button>
        <button
          className={`flex-1 rounded py-1.5 text-sm font-medium transition-colors ${
            !isSignIn ? "bg-gold-500 text-ink-950" : "text-muted hover:text-ivory"
          }`}
          onClick={openRegister}
          type="button"
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isSignIn && (
          <div>
            <label className="label mb-1.5 block">Full Name</label>
            <input
              className="input"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label className="label mb-1.5 block">Email Address</label>
          <input
            type="email"
            className="input"
            placeholder={isSignIn ? "your@email.com" : "you@example.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label mb-1.5 block">Password</label>
          <input
            type="password"
            className="input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isSignIn ? "current-password" : "new-password"}
            required
            minLength={isSignIn ? undefined : 8}
          />
        </div>

        {!isSignIn && (
          <div>
            <label className="label mb-1.5 block">Confirm Password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
        )}

        {isSignIn && (
          <div className="rounded-md border border-gold-500/30 bg-gold-500/5 p-3">
            <p className="mb-2 text-xs font-medium text-gold-400">Demo accounts — click to autofill:</p>
            <div className="space-y-1">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => autofill(acc)}
                  className="block text-xs text-muted hover:text-ivory"
                >
                  {acc.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-muted">Any password works with these demo accounts.</p>
          </div>
        )}

        {!isSignIn && (
          <div>
            <label className="label mb-1.5 block">Account Role</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole("member")}
                className={`flex-1 rounded-md border py-1.5 text-sm font-medium transition-colors ${
                  role === "member"
                    ? "border-gold-500 bg-gold-500 text-ink-950"
                    : "border-ink-600 text-muted hover:text-ivory"
                }`}
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 rounded-md border py-1.5 text-sm font-medium transition-colors ${
                  role === "admin"
                    ? "border-gold-500 bg-gold-500 text-ink-950"
                    : "border-ink-600 text-muted hover:text-ivory"
                }`}
              >
                Administrator
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? "Please wait…" : isSignIn ? "Sign In" : "Create Account"}
        </button>

        <button type="button" onClick={closeAuthModal} className="btn-link mx-auto block">
          Cancel
        </button>
      </form>
    </Modal>
  );
}
