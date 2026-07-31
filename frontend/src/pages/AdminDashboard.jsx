import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import StatCard from "../components/common/StatCard.jsx";
import OverviewTab from "../components/OverviewTab.jsx";
import MoviesTab from "../components/movies/MoviesTab.jsx";
import TheatersTab from "../components/theaters/TheatersTab.jsx";
import ShowtimesTab from "../components/showtimes/ShowtimesTab.jsx";
import { listMovies } from "../api/movies.js";
import { listTheaters } from "../api/theaters.js";
import { listShowtimes } from "../api/showtimes.js";
import { listBookings } from "../api/bookings.js";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "movies", label: "Movies" },
  { id: "theaters", label: "Theaters" },
  { id: "showtimes", label: "Showtimes" },
];

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState({ movies: [], theaters: [], showtimes: [], bookings: [] });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [movies, theaters, showtimes, bookings] = await Promise.all([
      listMovies(),
      listTheaters(),
      listShowtimes(),
      listBookings(),
    ]);
    setData({ movies, theaters, showtimes, bookings });
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) refresh();
  }, [isAdmin, refresh]);

  if (authLoading) return null;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  const confirmedBookings = data.bookings.filter((b) => b.status === "confirmed");
  const revenue = confirmedBookings.reduce((sum, b) => sum + b.totalCost, 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-ivory">Admin Dashboard</h1>
        <span className="pill">Administrator</span>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Films" value={data.movies.length} />
        <StatCard label="Theaters" value={data.theaters.length} />
        <StatCard label="Confirmed Bookings" value={confirmedBookings.length} />
        <StatCard label="Revenue" value={`$${revenue.toFixed(2)}`} />
      </div>

      <div className="mb-6 flex gap-8 border-b border-ink-700">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`tab ${tab === t.id ? "tab-active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading dashboard…</p>
      ) : (
        <>
          {tab === "overview" && <OverviewTab bookings={data.bookings} />}
          {tab === "movies" && (
            <MoviesTab movies={data.movies} showtimes={data.showtimes} onChanged={refresh} />
          )}
          {tab === "theaters" && (
            <TheatersTab theaters={data.theaters} showtimes={data.showtimes} onChanged={refresh} />
          )}
          {tab === "showtimes" && (
            <ShowtimesTab
              movies={data.movies}
              theaters={data.theaters}
              showtimes={data.showtimes}
              onChanged={refresh}
            />
          )}
        </>
      )}
    </div>
  );
}
