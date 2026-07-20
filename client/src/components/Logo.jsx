import logo from '../assets/mlogo.png';

export default function Logo({ className = '', containerClassName = '' }) {
  return (
    <img
      src={logo}
      alt="Junaid Furniture"
      className={`h-14 md:h-16 w-auto object-contain ${className}`}
    />
  );
}
