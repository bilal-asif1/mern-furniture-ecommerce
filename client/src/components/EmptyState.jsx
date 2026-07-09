import Button from './Button';

export default function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-black/10 bg-white p-10 text-center">
      <h3 className="font-display text-3xl font-semibold text-text">{title}</h3>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-text/65">{description}</p>
      {actionLabel && actionTo ? <Button className="mt-6" to={actionTo}>{actionLabel}</Button> : null}
    </div>
  );
}
