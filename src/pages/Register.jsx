import { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  // State for form inputs
  const [form, setForm] = useState({
    username: '',
    email: '', // Explicit email field
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState(''); // Only confirm password

  // State for validation errors
  const [errors, setErrors] = useState({});

  // State for submission feedback
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  // Client-side validation function
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Basic required field checks
    if (!form.username.trim()) { newErrors.username = 'Username is required.'; isValid = false; }
    if (!form.email.trim()) { newErrors.email = 'Email is required.'; isValid = false; }
    if (!form.password.trim()) { newErrors.password = 'Password is required.'; isValid = false; }
    if (!confirmPassword.trim()) { newErrors.confirmPassword = 'Confirm Password is required.'; isValid = false; }

    // Email format validation
    if (form.email.trim() && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email address is invalid.';
      isValid = false;
    }

    // Password length validation (example: min 6 characters)
    if (form.password.trim() && form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }

    // Password match validation
    if (form.password.trim() && confirmPassword.trim() && form.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    setStatusMessage(''); // Clear previous messages
    setIsSuccess(false);

    if (!validateForm()) {
      setStatusMessage('Please fix the errors in the form.');
      setIsSuccess(false);
      return;
    }

    try {
      // Send username, email, and password to backend
      const res = await api.post('/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      setStatusMessage(res.data.message || 'Registered successfully!');
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Navigate to login after 2 seconds

    } catch (error) {
      console.error("Registration error:", error);
      setStatusMessage(error.response?.data?.message || 'Registration failed. Please try again.');
      setIsSuccess(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error for the specific field as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="flex items-center justify-center flex-grow">
      <form onSubmit={handleSubmit} className="bg-[var(--color-surface-card)] p-8 rounded-lg shadow-xl w-full max-w-md border border-border-light">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">Register</h2>

        {/* Status Message Display */}
        {statusMessage && (
          <div className={`mb-4 p-3 rounded-md text-center text-sm ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-error-red'}`}>
            {statusMessage}
          </div>
        )}

        {/* Username Field */}
        <div className="mb-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className={`w-full p-3 border ${errors.username ? 'border-error-red' : 'border-border-light'} rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200 text-text-default`}
            value={form.username}
            onChange={handleChange}
            required
          />
          {errors.username && <p className="text-error-red text-xs mt-1">{errors.username}</p>}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <input
            type="email" // Use type="email" for better browser validation hints
            name="email"
            placeholder="Email"
            className={`w-full p-3 border ${errors.email ? 'border-error-red' : 'border-border-light'} rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200 text-text-default`}
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="text-error-red text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={`w-full p-3 border ${errors.password ? 'border-error-red' : 'border-border-light'} rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200 text-text-default`}
            value={form.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="text-error-red text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-6">
          <input
            type="password"
            name="confirmPassword" // Name is important for potential internal validation tracking
            placeholder="Confirm Password"
            className={`w-full p-3 border ${errors.confirmPassword ? 'border-error-red' : 'border-border-light'} rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200 text-text-default`}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) { // Clear error as user types
                setErrors(prev => ({ ...prev, confirmPassword: undefined }));
              }
            }}
            required
          />
          {errors.confirmPassword && <p className="text-error-red text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition-colors duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        >
          Register
        </button>
        <p className="mt-4 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;