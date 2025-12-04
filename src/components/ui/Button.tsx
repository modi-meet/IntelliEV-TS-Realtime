import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  href?: string;
  to?: string;
  variant?: 'primary' | 'secondary';
}

const Button = ({ children, className = '', href, to, variant = 'primary', ...props }: ButtonProps) => {
  const variants: Record<string, string> = {
    primary: 'bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg px-5 py-2.5 inline-block text-center transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg px-4 py-2 transition-colors duration-200 cursor-pointer'
  };

  const baseClasses = `${variants[variant] || variants.primary} ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses} {...(props as any)}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClasses} {...(props as any)}>
        {children}
      </a>
    );
  }

  return (
    <button className={baseClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
