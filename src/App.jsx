import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/layout/Navbar';
// import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
      </AuthProvider>
  );
}

export default App;