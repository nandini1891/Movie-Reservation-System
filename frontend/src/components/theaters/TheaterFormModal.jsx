import { useState } from "react";
import Modal from "../common/Modal.jsx";

export default function TheaterFormModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "", rows: "", seatsPerRow: "", description: "" });
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
      await onSubmit({
        name: form.name,
        rows: Number(form.rows),
        seatsPerRow: Number(form.seatsPerRow),
        description: form.description,
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save the theater. Please try again.");
      setSubmitting(false);
    }
  }

  const capacity = Number(form.rows || 0) * Number(form.seatsPerRow || 0);

  return (
    <Modal title="Add Theater" onClose={onClose} width="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label mb-1.5 block">Name</label>
          <input className="input" value={form.name} onChange={(e) => update("name", e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label mb-1.5 block">Rows</label>
            <input
              type="number"
              min="1"
              className="input"
              value={form.rows}
              onChange={(e) => update("rows", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label mb-1.5 block">Seats per row</label>
            <input
              type="number"
              min="1"
              className="input"
              value={form.seatsPerRow}
              onChange={(e) => update("seatsPerRow", e.target.value)}
              required
            />
          </div>
        </div>

        {capacity > 0 && <p className="text-xs text-muted">Capacity: {capacity} seats</p>}

        <div>
          <label className="label mb-1.5 block">Description</label>
          <textarea
            className="input min-h-[70px] resize-y"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : "Add Theater"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
