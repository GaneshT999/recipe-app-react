import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername);
    };

    // Listen for custom event to update navbar
    window.addEventListener('storageChange', handleStorageChange);
    
    // Initial check
    handleStorageChange();

    return () => {
      window.removeEventListener('storageChange', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.dispatchEvent(new Event('storageChange')); // Notify other components
    navigate('/login');
  };

  const isLoggedIn = !!localStorage.getItem('token');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md w-screen">
      <div className="container mx-auto p-4 flex justify-between items-center px-6 md:px-8 lg:px-10">

        {/* MODIFIED: Logo now links to "/" */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl md:text-3xl font-bold text-primary">
            RecipeAI
          </span>
        </Link>

        {isAuthPage ? (
          <div className="flex items-center">
            {location.pathname === '/login' && (
              <Link to="/register" className="text-lg md:text-xl font-semibold text-primary hover:text-primary-dark transition-colors duration-200">
                Register
              </Link>
            )}
            {location.pathname === '/register' && (
              <Link to="/login" className="text-lg md:text-xl font-semibold text-primary hover:text-primary-dark transition-colors duration-200">
                Login
              </Link>
            )}
          </div>
        ) : isLoggedIn ? (
          <>
            {/* MODIFIED: Added Home link and reordered */}
            <div className="flex items-center space-x-6 md:space-x-8">
              <Link to="/" className="text-lg md:text-xl font-semibold text-primary hover:text-primary-dark transition-colors duration-200">
                Home
              </Link>
              <Link to="/dashboard" className="text-lg md:text-xl font-semibold text-primary hover:text-primary-dark transition-colors duration-200">
                My Recipes
              </Link>
              <Link to="/recipe-form" className="text-lg md:text-xl font-semibold text-primary hover:text-primary-dark transition-colors duration-200">
                Generate
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {username && (
                <span className="text-text-default text-lg font-medium">Hello, {username}!</span>
              )}
              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        ) : (
           // For non-logged-in users on pages other than auth pages (like Home)
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-lg md:text-xl font-semibold text-primary hover:text-primary-dark transition-colors duration-200">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 bg-primary text-white text-md font-semibold rounded-md hover:bg-primary-dark transition-colors duration-200">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
