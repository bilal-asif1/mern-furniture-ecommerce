import { Link } from 'react-router-dom';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-[#734d31] shadow-soft',
    secondary: 'bg-[#eadfce] text-text hover:bg-[#dcc8ad]',
    ghost: 'bg-white/80 text-text border border-black/10 hover:bg-white',
    dark: 'bg-text text-white hover:bg-black shadow-soft',
  };

  const baseClass = `inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`;

  if (props.to) {
    const { to, type, disabled, ...rest } = props;
    return (
      <Link to={to} className={baseClass} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type || 'button'}
      className={baseClass}
      {...props}
    >
      {children}
    </button>
  );
}
