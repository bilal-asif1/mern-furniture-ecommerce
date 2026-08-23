import { Link } from 'react-router-dom';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-[#68462d] shadow-soft border border-transparent',
    secondary: 'bg-[#eadcc9] text-text hover:bg-[#dcc6ab] border border-transparent',
    outline: 'bg-transparent text-text border border-[#d9cab8] hover:border-primary hover:text-primary hover:bg-white/50',
    ghost: 'bg-white/75 text-text border border-[#e0d2c0] hover:bg-white hover:border-[#cfbea9]',
    dark: 'bg-text text-white hover:bg-black shadow-soft border border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-soft border border-transparent',
  };

  const baseClass = `inline-flex items-center justify-center rounded-[1.1rem] px-5 py-3 text-sm font-semibold tracking-[0.02em] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${variants[variant]} ${className}`;

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
