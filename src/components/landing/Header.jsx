import React from 'react';
import Button from '../ui/Button';

const Header = () => {
  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-[#dee2e6] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2">
          <svg
            className="h-8 w-auto text-[#212529]"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 3C10.067 3 8.5 4.567 8.5 6.5C8.5 8.433 10.067 10 12 10C13.933 10 15.5 8.433 15.5 6.5C15.5 4.567 13.933 3 12 3ZM11 12H13V21H11V12Z" />
          </svg>
          <span
            className="text-3xl font-extrabold text-[#212529]"
          >
            IntelliEV
          </span>
        </a>
        <nav
          className="hidden md:flex space-x-8 items-center font-semibold text-[#6c757d]"
        >
          <a
            href="#features"
            className="hover:text-black transition-colors duration-300"
          >
            Features
          </a>
          <a
            href="#audience"
            className="hover:text-black transition-colors duration-300"
          >
            Who It's For
          </a>
          <a
            href="#contact"
            className="hover:text-black transition-colors duration-300"
          >
            Contact
          </a>
        </nav>
        <div>
          <Button
            to="/login"
            className="font-semibold"
          >
            Join The Network
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
