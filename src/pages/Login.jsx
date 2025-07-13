import { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(''); // State for handling login errors
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      
      // MODIFIED: Dispatch event to notify Navbar of login
      window.dispatchEvent(new Event('storageChange'));
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      console.error("Login error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center flex-grow">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-border-light">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">Login</h2>
        
        {error && (
          <div className="mb-4 p-3 rounded-md text-center text-sm bg-red-100 text-error-red">
            {error}
          </div>
        )}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border border-border-light rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200 text-text-default"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-border-light rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200 text-text-default"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition-colors duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        >
          Login
        </button>
        <p className="mt-4 text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
