import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navLinkClass = ({ isActive }) =>
  `text-sm transition-colors ${isActive ? "text-gold-400" : "text-muted hover:text-ivory"}`;

export default function Navbar() {
  const { user, isAdmin, openSignIn, signOut } = useAuth();

  return (
    <header className="border-b border-ink-700">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="font-display text-lg font-bold tracking-wide text-gold-500">
            CINÉ<span className="text-ivory">VAULT</span>
          </span>
          <nav className="flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>
              Films
            </NavLink>
            <NavLink to="/my-bookings" className={navLinkClass}>
              My Bookings
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-right leading-tight">
                <p className="text-sm font-medium text-ivory">{user.name}</p>
                <p className="text-xs text-muted">{isAdmin ? "Administrator" : "Member"}</p>
              </div>
              {isAdmin && <span className="pill">Admin</span>}
              <button className="btn-link" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={openSignIn}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
