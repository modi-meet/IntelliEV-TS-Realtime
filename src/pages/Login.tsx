import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/authServices';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import { FaCarSide, FaTruckMedical } from 'react-icons/fa6';

const Login = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [role, setRole] = useState<'ev' | 'emergency' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    regNumber: ''
  });

  const handleRoleSelect = (selectedRole: 'ev' | 'emergency') => {
    setRole(selectedRole);
    setIsModalOpen(true);
    setIsLoginMode(true);
    setNotification({ show: false, message: '', type: '' });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRole(null);
    setFormData({ username: '', email: '', password: '', regNumber: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (isLoginMode) {
        await loginUser(formData.email, formData.password, role || undefined);
        
        showNotification('Login successful!', 'success');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        if (!role) {
          throw new Error("Please select a role");
        }
        await registerUser({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          regNumber: formData.regNumber,
          userType: role
        });
        showNotification('Registration successful!', 'success');
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (error: any) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-['Lexend',sans-serif]">
      <Header />
      <div 
        className="flex-grow flex items-center justify-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(-45deg, #e7f3ff, #e2ebf0, #ffeeee, #cfd9df)',
          backgroundSize: '400% 400%',
          animation: 'gradientBG 15s ease infinite'
        }}
      >
        <div className="main-container m-18">
          <h1>Welcome to IntelliEV</h1>
          <p>Please select your role to login or register.</p>
          <div className="role-selection">
            <div 
              className={`role-card ev-user ${role === 'ev' ? 'selected' : ''}`} 
              onClick={() => handleRoleSelect('ev')}
            >
              <FaCarSide className="role-icon" />
              <h2>EV Driver</h2>
            </div>
            <div 
              className={`role-card emergency-user ${role === 'emergency' ? 'selected' : ''}`} 
              onClick={() => handleRoleSelect('emergency')}
            >
              <FaTruckMedical className="role-icon" />
              <h2>Emergency Responder</h2>
            </div>
          </div>
        </div>

        <div className={`modal-overlay ${isModalOpen ? 'visible' : ''}`}>
          <div className={`modal-content ${isLoginMode ? 'show-login' : 'show-signup'}`}>
            <h2>{isLoginMode ? 'Login' : 'Sign Up'} as {role === 'ev' ? 'EV Driver' : 'Emergency Responder'}</h2>
            
            <div className="form-group" id="usernameGroup">
              <label htmlFor="username">Your Name</label>
              <input 
                type="text" 
                id="username" 
                placeholder="e.g., Jane Doe" 
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="you@example.com" 
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password (min. 6 characters)</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            
            {!isLoginMode && (
              <div className="form-group" id="regGroup">
                <label htmlFor="regNumber">
                  {role === 'ev' ? 'Vehicle Registration Number' : 'Emergency Unit ID'}
                </label>
                <input 
                  type="text" 
                  id="regNumber" 
                  value={formData.regNumber}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <button 
              className={`modal-button ${loading ? 'loading' : ''}`} 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '' : (isLoginMode ? 'Login' : 'Sign Up')}
            </button>
            
            <button className="modal-button close-btn" onClick={closeModal}>Cancel</button>
            
            <div className="switch-link">
              <span id="loginHint">
                Don't have an account? <a onClick={() => setIsLoginMode(false)}>Sign Up</a>
              </span>
              <span id="signupHint">
                Already have an account? <a onClick={() => setIsLoginMode(true)}>Login</a>
              </span>
            </div>
          </div>
        </div>

        <div id="notification-toast" className={`${notification.show ? 'show' : ''} ${notification.type}`}>
          {notification.message}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;