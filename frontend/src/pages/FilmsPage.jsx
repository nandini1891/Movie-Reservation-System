import { useEffect, useState } from "react";
import { listMovies } from "../api/movies.js";

export default function FilmsPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    listMovies().then(setMovies);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-1 text-3xl font-bold text-ivory">This Week's Films</h1>
      <p className="mb-8 text-sm text-muted">
        This is a placeholder browse page — the admin build lives at <span className="text-gold-400">/admin</span>.
      </p>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">
        {movies.map((m) => (
          <div key={m.id} className="card overflow-hidden">
            {m.posterUrl ? (
              <img src={m.posterUrl} alt={`${m.title} poster`} className="aspect-[2/3] w-full object-cover" />
            ) : (
              <div className="aspect-[2/3] bg-ink-700" />
            )}
            <div className="p-3">
              <p className="truncate text-sm font-medium text-ivory">{m.title}</p>
              <p className="text-xs text-muted">{m.genre}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
