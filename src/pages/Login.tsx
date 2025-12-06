import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/authServices';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import { FaCarSide, FaTruckMedical } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [role, setRole] = useState<'ev' | 'emergency' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  const bgPattern = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23e9ecef' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h4v-9H0v-1h4v-9H0v-1h4v-9H0v-1h4v-9H0v-1h4v-9H0v-1h4v-9H0v-1h4v-9H0v-1h4v-9H0v-1h4V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm-9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm-9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9z'/%3E%3Cpath d='M6 5V0h1v5h5V0h1v5h5V0h1v5h5V0h1v5h5V0h1v5h5V0h1v5h5V0h1v5h5V0h1v5h5V0h1v5h5V0h1v5h4v1h-4v5h4v1h-4v5h4v1h-4v5h4v1h-4v5h4v1h-4v5h4v1h-4v5h4v1h-4v5h4v1h-4v4h-1v-4h-5v4h-1v-4h-5v4h-1v-4h-5v4h-1v-4h-5v4h-1v-4h-5v4h-1v-4h-5v4h-1v-4h-5v4h-1v-4H0v-1h4v-5H0v-1h4v-5H0v-1h4v-5H0v-1h4v-5H0v-1h4v-5H0v-1h4v-5H0v-1h4v-5H0V5h6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  useEffect(() => {
    window.scrollTo(0, 0);
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
        className="flex-grow flex items-center justify-center relative overflow-hidden bg-gray-50"
        style={{ backgroundImage: `url("${bgPattern}")` }}
      >
        <div className="w-full max-w-4xl px-4 py-12 z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#212529] mb-4">Welcome to IntelliEV</h1>
            <p className="text-xl text-[#6c757d]">Please select your role to login or register.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div 
              className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 click-animate ${role === 'ev' ? 'border-blue-500 ring-4 ring-blue-100' : 'border-transparent hover:border-blue-200'}`}
              onClick={() => handleRoleSelect('ev')}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
                  <FaCarSide className="text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-[#212529] mb-2">EV Driver</h2>
                <p className="text-[#6c757d]">Access navigation, report hazards, and connect with the community.</p>
              </div>
            </div>

            <div 
              className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 click-animate ${role === 'emergency' ? 'border-red-500 ring-4 ring-red-100' : 'border-transparent hover:border-red-200'}`}
              onClick={() => handleRoleSelect('emergency')}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600">
                  <FaTruckMedical className="text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-[#212529] mb-2">Emergency Responder</h2>
                <p className="text-[#6c757d]">Manage fleet, receive SOS alerts, and coordinate emergency response.</p>
              </div>
            </div>
          </div>
          <div className="h-32"></div>
        </div>

        {/* Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-[#212529]">
                  {isLoginMode ? 'Login' : 'Sign Up'} as {role === 'ev' ? 'EV Driver' : 'Responder'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors click-animate">
                  <FaTimes />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                {!isLoginMode && (
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Your Name</label>
                    <input 
                      type="text" 
                      id="username" 
                      placeholder="e.g., Jane Doe" 
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="you@example.com" 
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                
                {!isLoginMode && (
                  <div className="space-y-2">
                    <label htmlFor="regNumber" className="block text-sm font-medium text-gray-700">
                      {role === 'ev' ? 'Vehicle Registration Number' : 'Emergency Unit ID'}
                    </label>
                    <input 
                      type="text" 
                      id="regNumber" 
                      value={formData.regNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                )}

                <button 
                  className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform click-animate ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : (isLoginMode ? 'Login' : 'Create Account')}
                </button>
                
                <div className="text-center text-sm text-gray-600 mt-4">
                  {isLoginMode ? (
                    <p>Don't have an account? <button onClick={() => setIsLoginMode(false)} className="text-blue-600 font-semibold hover:underline">Sign Up</button></p>
                  ) : (
                    <p>Already have an account? <button onClick={() => setIsLoginMode(true)} className="text-blue-600 font-semibold hover:underline">Login</button></p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Toast */}
        {notification.show && (
          <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-lg text-white font-medium animate-in slide-in-from-bottom-4 fade-in duration-300 ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
            {notification.message}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Login;