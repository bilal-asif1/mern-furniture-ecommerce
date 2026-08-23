export default function SectionTitle({ eyebrow, title, description, align = 'left' }) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : '';
  return (
    <div className={`max-w-3xl ${alignClass}`}>
      {eyebrow ? <p className="page-ribbon mb-4">{eyebrow}</p> : null}
      <h2 className="font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-[3.6rem]">{title}</h2>
      {description ? <p className="mt-4 max-w-2xl text-sm leading-7 text-text/70 sm:text-base sm:leading-8">{description}</p> : null}
    </div>
  );
}
