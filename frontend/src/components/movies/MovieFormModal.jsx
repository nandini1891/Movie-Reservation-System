import { useState } from "react";
import Modal from "../common/Modal.jsx";

const RATINGS = ["G", "PG", "PG-13", "R", "NC-17"];

export default function MovieFormModal({ initial, onClose, onSubmit }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState({
    title: initial?.title || "",
    genre: initial?.genre || "",
    durationMinutes: initial?.durationMinutes || "",
    rating: initial?.rating || "PG-13",
    description: initial?.description || "",
    posterUrl: initial?.posterUrl || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ ...form, durationMinutes: Number(form.durationMinutes) });
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save the film. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <Modal title={isEdit ? "Edit Film" : "Add Film"} onClose={onClose} width="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label mb-1.5 block">Title</label>
          <input
            className="input"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label mb-1.5 block">Genre</label>
            <input
              className="input"
              value={form.genre}
              onChange={(e) => update("genre", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label mb-1.5 block">Duration (minutes)</label>
            <input
              type="number"
              min="1"
              className="input"
              value={form.durationMinutes}
              onChange={(e) => update("durationMinutes", e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="label mb-1.5 block">Rating</label>
          <div className="flex gap-2">
            {RATINGS.map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => update("rating", r)}
                className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                  form.rating === r
                    ? "border-gold-500 bg-gold-500 text-ink-950"
                    : "border-ink-600 text-muted hover:text-ivory"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label mb-1.5 block">Description</label>
          <textarea
            className="input min-h-[80px] resize-y"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        <div>
          <label className="label mb-1.5 block">Poster URL (optional)</label>
          <input
            className="input"
            placeholder="https://…"
            value={form.posterUrl}
            onChange={(e) => update("posterUrl", e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : isEdit ? "Save Changes" : "Add Film"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
