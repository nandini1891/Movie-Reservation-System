function formatDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function OverviewTab({ bookings }) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-ivory">All Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-sm text-muted">No bookings yet.</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-700 text-muted">
                <th className="label px-4 py-3 font-medium">Booking ID</th>
                <th className="label px-4 py-3 font-medium">Film</th>
                <th className="label px-4 py-3 font-medium">Showtime</th>
                <th className="label px-4 py-3 font-medium">Seats</th>
                <th className="label px-4 py-3 font-medium">Customer</th>
                <th className="label px-4 py-3 font-medium">Total</th>
                <th className="label px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-ink-700 last:border-0">
                  <td className="px-4 py-3 text-ivory">{b.id}</td>
                  <td className="px-4 py-3 text-ivory">{b.movieTitle}</td>
                  <td className="px-4 py-3 text-muted">{formatDateTime(b.showtime)}</td>
                  <td className="px-4 py-3 text-muted">{b.seats.join(", ")}</td>
                  <td className="px-4 py-3 text-muted">{b.userName}</td>
                  <td className="px-4 py-3 text-gold-400">${b.totalCost.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`pill ${
                        b.status === "cancelled" ? "border-red-500/40 bg-red-500/10 text-red-400" : ""
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
