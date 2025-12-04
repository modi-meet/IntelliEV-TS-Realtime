import React, { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const TextArea = ({ className = '', ...props }: TextAreaProps) => {
  return (
    <textarea
      className={`w-full p-3 rounded-md shadow-sm bg-white border border-gray-300 text-gray-800 transition-colors duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none ${className}`}
      {...props}
    />
  );
};

export default TextArea;
