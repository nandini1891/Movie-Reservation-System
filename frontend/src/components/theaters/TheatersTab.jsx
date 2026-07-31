import { useState } from "react";
import TheaterFormModal from "./TheaterFormModal.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import { createTheater, deleteTheater } from "../../api/theaters.js";

export default function TheatersTab({ theaters, showtimes, onChanged }) {
  const [adding, setAdding] = useState(false);
  const [pendingRemove, setPendingRemove] = useState(null);
  const [busy, setBusy] = useState(false);

  const activeShowsFor = (theaterId) => showtimes.filter((s) => s.theaterId === theaterId).length;

  async function handleSubmit(payload) {
    await createTheater(payload);
    setAdding(false);
    onChanged();
  }

  async function handleRemove() {
    setBusy(true);
    try {
      await deleteTheater(pendingRemove.id);
      setPendingRemove(null);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ivory">Theaters</h2>
        <button className="btn-primary" onClick={() => setAdding(true)}>
          + Add Theater
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-700 text-muted">
              <th className="label px-4 py-3 font-medium">Name</th>
              <th className="label px-4 py-3 font-medium">Capacity</th>
              <th className="label px-4 py-3 font-medium">Description</th>
              <th className="label px-4 py-3 font-medium">Active Shows</th>
              <th className="label px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {theaters.map((t) => (
              <tr key={t.id} className="border-b border-ink-700 last:border-0">
                <td className="px-4 py-3 font-medium text-ivory">{t.name}</td>
                <td className="px-4 py-3 text-gold-400">
                  {t.rows * t.seatsPerRow} seats ({t.rows}×{t.seatsPerRow})
                </td>
                <td className="px-4 py-3 text-muted">{t.description}</td>
                <td className="px-4 py-3 text-muted">{activeShowsFor(t.id)}</td>
                <td className="px-4 py-3">
                  <button className="text-sm text-muted hover:text-red-400" onClick={() => setPendingRemove(t)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {theaters.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">
                  No theaters yet. Add your first theater to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {adding && <TheaterFormModal onClose={() => setAdding(false)} onSubmit={handleSubmit} />}

      {pendingRemove && (
        <ConfirmDialog
          title="Remove theater"
          message={`Remove "${pendingRemove.name}"? This also removes its showtimes.`}
          onConfirm={handleRemove}
          onCancel={() => setPendingRemove(null)}
          busy={busy}
        />
      )}
    </div>
  );
}
