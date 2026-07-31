export default function StatCard({ label, value }) {
  return (
    <div className="card px-5 py-4">
      <p className="label">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gold-500 font-display">{value}</p>
    </div>
  );
}
