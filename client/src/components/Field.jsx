export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-[10px] font-semibold uppercase tracking-[0.22em] text-text/70">{label}</span>
      {children}
      {hint ? <span className="mt-2 block text-xs text-text/50">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props) {
  return (
    <input
      className="field-shell"
      {...props}
    />
  );
}

export function TextArea(props) {
  return (
    <textarea
      className="field-shell min-h-28 py-3"
      rows={props.rows || 4}
      {...props}
    />
  );
}

export function SelectField(props) {
  return (
    <select
      className="field-shell"
      {...props}
    />
  );
}
