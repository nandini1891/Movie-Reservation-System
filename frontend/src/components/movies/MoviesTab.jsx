import { useState } from "react";
import MovieFormModal from "./MovieFormModal.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import { createMovie, updateMovie, deleteMovie } from "../../api/movies.js";

export default function MoviesTab({ movies, showtimes, onChanged }) {
  const [editing, setEditing] = useState(null); // null | "new" | movie object
  const [pendingRemove, setPendingRemove] = useState(null);
  const [busy, setBusy] = useState(false);

  const showCountFor = (movieId) => showtimes.filter((s) => s.movieId === movieId).length;

  async function handleSubmit(payload) {
    if (editing && editing !== "new") {
      await updateMovie(editing.id, payload);
    } else {
      await createMovie(payload);
    }
    setEditing(null);
    onChanged();
  }

  async function handleRemove() {
    setBusy(true);
    try {
      await deleteMovie(pendingRemove.id);
      setPendingRemove(null);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ivory">Films</h2>
        <button className="btn-primary" onClick={() => setEditing("new")}>
          + Add Film
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-700 text-muted">
              <th className="label px-4 py-3 font-medium">Title</th>
              <th className="label px-4 py-3 font-medium">Genre</th>
              <th className="label px-4 py-3 font-medium">Duration</th>
              <th className="label px-4 py-3 font-medium">Rating</th>
              <th className="label px-4 py-3 font-medium">Shows</th>
              <th className="label px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.id} className="border-b border-ink-700 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {m.posterUrl ? (
                      <img
                        src={m.posterUrl}
                        alt={`${m.title} poster`}
                        className="h-10 w-8 flex-shrink-0 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-8 flex-shrink-0 rounded bg-ink-700" />
                    )}
                    <span className="font-medium text-ivory">{m.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gold-400">{m.genre}</td>
                <td className="px-4 py-3 text-muted">{m.durationMinutes}m</td>
                <td className="px-4 py-3">
                  <span className="rounded border border-ink-600 px-2 py-0.5 text-xs text-muted">
                    {m.rating}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{showCountFor(m.id)}</td>
                <td className="px-4 py-3">
                  <button className="mr-3 text-sm text-gold-400 hover:text-gold-300" onClick={() => setEditing(m)}>
                    Edit
                  </button>
                  <button className="text-sm text-muted hover:text-red-400" onClick={() => setPendingRemove(m)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {movies.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted">
                  No films yet. Add your first film to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <MovieFormModal
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSubmit={handleSubmit}
        />
      )}

      {pendingRemove && (
        <ConfirmDialog
          title="Remove film"
          message={`Remove "${pendingRemove.title}"? This also removes its showtimes.`}
          onConfirm={handleRemove}
          onCancel={() => setPendingRemove(null)}
          busy={busy}
        />
      )}
    </div>
  );
}
