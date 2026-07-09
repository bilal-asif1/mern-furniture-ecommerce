export default function SectionTitle({ eyebrow, title, description, align = 'left' }) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : '';
  return (
    <div className={`max-w-3xl ${alignClass}`}>
      {eyebrow ? <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-primary">{eyebrow}</p> : null}
      <h2 className="font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-sm leading-7 text-text/70 sm:text-base">{description}</p> : null}
    </div>
  );
}
