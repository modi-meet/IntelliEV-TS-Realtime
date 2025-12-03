import React from 'react';

const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full px-4 py-3 rounded-md shadow-sm bg-white border border-gray-300 text-gray-800 transition-colors duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none ${className}`}
      {...props}
    />
  );
};

export default Input;
