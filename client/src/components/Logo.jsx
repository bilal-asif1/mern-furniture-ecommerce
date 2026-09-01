const logo = new URL('../assets/images/shop/logo.PNG', import.meta.url).href;

export default function Logo({ className = '', containerClassName = '' }) {
  return (
    <div className={`inline-flex items-center ${containerClassName}`}>
      <img
        src={logo}
        alt="Junaid Furniture Logo"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        draggable="false"
        className={`h-11 w-auto object-contain sm:h-12 md:h-14 ${className}`}
      />
    </div>
  );
}
