import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`
        bg-white rounded-xl p-8
        border border-[#dee2e6] 
        transition-all duration-300 ease-out 
        shadow-[0_8px_25px_-10px_rgba(0,0,0,0.05)] 
        hover:-translate-y-1 hover:border-[#20c997] 
        hover:shadow-[0_12px_35px_-10px_rgba(0,0,0,0.1)]
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
