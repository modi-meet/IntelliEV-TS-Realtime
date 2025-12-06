import React from 'react';
import { FaTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      className="text-white py-12 bg-[#212529]"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <svg
            className="h-8 w-auto text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 3C10.067 3 8.5 4.567 8.5 6.5C8.5 8.433 10.067 10 12 10C13.933 10 15.5 8.433 15.5 6.5C15.5 4.567 13.933 3 12 3ZM11 12H13V21H11V12Z" />
          </svg>
          <h4 className="text-2xl font-bold">IntelliEV</h4>
        </div>
        <div className="flex justify-center space-x-6 mb-6 text-lg text-gray-400">
          <a
            href="/#features"
            className="hover:text-white transition-colors duration-300"
          >
            Features
          </a>
          <a
            href="/#audience"
            className="hover:text-white transition-colors duration-300"
          >
            Who It's For
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors duration-300"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors duration-300"
          >
            Terms of Service
          </a>
        </div>
        <div className="flex justify-center space-x-6 text-2xl mb-8">
          <a
            href="#"
            className="text-gray-500 hover:text-white transition-transform duration-300 transform hover:scale-110"
          >
            <FaTwitter />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-white transition-transform duration-300 transform hover:scale-110"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-white transition-transform duration-300 transform hover:scale-110"
          >
            <FaGithub />
          </a>
        </div>
        <p className="text-gray-500">
          Built with ❤️ for safer roads and smarter cities.
        </p>
        <p className="text-gray-500">
          &copy; 2025 IntelliEV Network. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
