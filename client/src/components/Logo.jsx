export default function Logo({ className = '', containerClassName = '' }) {
  return (
    <div className={`inline-flex items-center ${containerClassName}`}>
      <img
        src="/logo.png"
        alt="Junaid Furniture"
        className={`h-12 w-auto object-contain sm:h-14 md:h-16 ${className}`}
      />
    </div>
  );
}
