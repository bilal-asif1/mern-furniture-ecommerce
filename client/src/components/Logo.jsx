import logo from '../assets/logo.png';

export default function Logo({ className = '', containerClassName = '' }) {
  return (
    <div className={`inline-flex items-center justify-center rounded-xl bg-zinc-950 px-3 py-1.5 shadow-sm ${containerClassName}`}>
      <img
        src={logo}
        alt="Junaid Furniture"
        className={`w-auto object-contain ${className || 'h-9 sm:h-10 md:h-12 lg:h-14'}`}
      />
    </div>
  );
}
