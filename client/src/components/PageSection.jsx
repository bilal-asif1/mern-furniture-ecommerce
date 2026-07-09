export default function PageSection({ children, className = '' }) {
  return <section className={`section-shell relative ${className}`}>{children}</section>;
}
