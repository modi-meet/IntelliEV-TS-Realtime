import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { scrollToSection } from '../../utils/scroll';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          element.classList.add('target-highlight');
          setTimeout(() => element.classList.remove('target-highlight'), 2000);
        }
      }, 100);
    } else {
      scrollToSection(e, id);
    }
  };

  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-[#dee2e6] sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
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
        </Link>
        <nav
          className="hidden md:flex space-x-8 items-center font-semibold text-[#6c757d]"
        >
          <a
            href="#features"
            onClick={(e) => handleNavClick(e, 'features')}
            className="hover:text-black transition-colors duration-300 relative group"
          >
            Features
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a
            href="#audience"
            onClick={(e) => handleNavClick(e, 'audience')}
            className="hover:text-black transition-colors duration-300 relative group"
          >
            Who It's For
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className="hover:text-black transition-colors duration-300 relative group"
          >
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
          </a>
        </nav>
        <div>
          <Button
            to="/login"
            className="font-semibold transform hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg"
            href={undefined}
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};


export default Header;
