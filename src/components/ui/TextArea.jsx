import React from 'react';

const TextArea = ({ className = '', ...props }) => {
  return (
    <textarea
      className={`
        w-full px-4 py-3 rounded-md shadow-sm 
        bg-white border border-[#dee2e6] text-[#212529] 
        transition-all duration-300 ease-out 
        focus:border-[#20c997] focus:ring-4 focus:ring-[rgba(32,201,151,0.2)] focus:outline-none
        ${className}
      `}
      {...props}
    />
  );
};

export default TextArea;
