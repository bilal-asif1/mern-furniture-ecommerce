export default function MetricCard({ label, value, delta }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-card">
      <p className="text-sm font-medium text-text/60">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="font-display text-4xl font-semibold text-text">{value}</p>
        <span className="rounded-full bg-[#f2e6db] px-3 py-1 text-xs font-semibold text-primary">{delta}</span>
      </div>
    </div>
  );
}
