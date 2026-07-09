export default function QuantityStepper({ value, onChange }) {
  return (
    <div className="inline-flex items-center rounded-full border border-black/10 bg-white">
      <button className="px-4 py-2 text-lg text-text/70" onClick={() => onChange(Math.max(1, value - 1))} type="button">
        -
      </button>
      <span className="min-w-10 px-3 text-sm font-semibold">{value}</span>
      <button className="px-4 py-2 text-lg text-text/70" onClick={() => onChange(value + 1)} type="button">
        +
      </button>
    </div>
  );
}
