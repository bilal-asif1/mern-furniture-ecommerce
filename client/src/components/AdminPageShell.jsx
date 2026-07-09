export default function AdminPageShell({ title, description, children, actions }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Admin</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-text">{title}</h1>
          {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-text/65">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}
