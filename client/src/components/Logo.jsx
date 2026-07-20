import logo from '../assets/logo.png';

export default function Logo({ className = '', containerClassName = '' }) {
  return (
    <img
      src={logo}
      alt="Junaid Furniture"
      className={`w-auto object-contain ${className || 'h-12'} ${containerClassName}`}
    />
  );
}
