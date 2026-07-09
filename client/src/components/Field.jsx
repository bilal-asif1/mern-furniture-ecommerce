export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.18em] text-text/70">{label}</span>
      {children}
      {hint ? <span className="mt-2 block text-xs text-text/50">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props) {
  return (
    <input
      className="w-full rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-sm outline-none transition placeholder:text-text/35 focus:border-primary focus:ring-2 focus:ring-primary/10"
      {...props}
    />
  );
}

export function TextArea(props) {
  return (
    <textarea
      className="w-full rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-sm outline-none transition placeholder:text-text/35 focus:border-primary focus:ring-2 focus:ring-primary/10"
      rows={props.rows || 4}
      {...props}
    />
  );
}

export function SelectField(props) {
  return (
    <select
      className="w-full rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      {...props}
    />
  );
}
