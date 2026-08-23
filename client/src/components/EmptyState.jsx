import Button from './Button';

export default function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <div className="premium-panel bg-white/90 p-10 text-center sm:p-12">
      <p className="page-ribbon mx-auto">Junaid Furniture</p>
      <h3 className="mt-5 font-display text-3xl font-semibold text-text sm:text-4xl">{title}</h3>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-text/65 sm:text-base">{description}</p>
      {actionLabel && actionTo ? <Button className="mt-7" to={actionTo}>{actionLabel}</Button> : null}
    </div>
  );
}
