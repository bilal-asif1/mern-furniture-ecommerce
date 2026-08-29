import mlogo from '../assets/mlogo.png';

export default function Logo({ className = '', containerClassName = '' }) {
  return (
    <div className={`inline-flex items-center ${containerClassName}`}>
      <img
        src={mlogo}
        alt="Junaid Furniture"
        className={`h-11 w-auto object-contain sm:h-12 md:h-14 ${className}`}
      />
    </div>
  );
}
