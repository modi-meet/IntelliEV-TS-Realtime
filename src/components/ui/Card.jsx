import React from 'react';

const Card = ({ children, className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-white rounded-xl shadow-sm',
    landing: 'bg-white rounded-xl p-8 border border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
  };

  return (
    <div
      className={`${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
