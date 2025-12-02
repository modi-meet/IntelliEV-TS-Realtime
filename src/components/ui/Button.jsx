import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ children, className = '', href, to, ...props }) => {
  const baseClasses = `
    bg-[#20c997] text-white font-bold rounded-lg 
    transition-all duration-300 ease-out 
    shadow-[0_4px_15px_-5px_rgba(32,201,151,0.3)] 
    hover:bg-[#1baa80] hover:-translate-y-1 
    hover:shadow-[0_7px_20px_-5px_rgba(32,201,151,0.4)]
    px-5 py-2.5 inline-block text-center cursor-pointer
    ${className}
  `;

  if (to) {
    return (
      <Link to={to} className={baseClasses} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClasses} {...props}>
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
