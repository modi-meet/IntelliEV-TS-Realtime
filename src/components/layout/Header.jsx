import React from 'react';
import Button from '../ui/Button';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Header = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm py-2 px-4 flex justify-between items-center z-20 flex-shrink-0 h-16">
      <div className="flex items-center gap-2">
        <svg className="h-8 w-auto text-blue-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3C10.067 3 8.5 4.567 8.5 6.5C8.5 8.433 10.067 10 12 10C13.933 10 15.5 8.433 15.5 6.5C15.5 4.567 13.933 3 12 3ZM11 12H13V21H11V12Z"/>
        </svg>
        <h1 className="text-xl font-bold text-blue-600">IntelliEV Network</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block leading-tight">
          <p className="font-semibold text-gray-800 text-sm">{user?.username || 'Test user'}</p>
          <p className="text-xs text-gray-500">{user?.regNumber || 'KA51MA8686'}</p>
        </div>
        <Button
          onClick={handleLogout}
          className="bg-red-500 text-white font-semibold px-3 py-1.5 text-sm rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
