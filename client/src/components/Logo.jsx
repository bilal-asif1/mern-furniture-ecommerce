import logo from '../assets/nlogo.jpeg';

export default function Logo({ className = '' }) {
  return (
    <img
      src={logo}
      alt="Junaid Furniture"
      className={`w-auto object-contain ${className || 'h-9 sm:h-10 md:h-12 lg:h-14'}`}
    />
  );
}
