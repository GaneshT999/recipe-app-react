import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// --- SVG Icons ---
const MenuIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
  </svg>
);
const XIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername);
    };

    window.addEventListener('storageChange', handleStorageChange);
    handleStorageChange(); // Initial check

    // Close mobile menu if route changes
    setIsMenuOpen(false); 

    return () => {
      window.removeEventListener('storageChange', handleStorageChange);
    };
  }, [location.pathname]); // Re-run effect when location changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.dispatchEvent(new Event('storageChange'));
    navigate('/login');
  };

  // --- ENSURE THESE VARIABLES ARE DEFINED HERE ---
  const isLoggedIn = !!localStorage.getItem('token');
  const isLoginPage = location.pathname === '/login'; // <--- This line
  const isRegisterPage = location.pathname === '/register'; // <--- This line
  const isAuthPage = isLoginPage || isRegisterPage; // <--- This line

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md w-screen">
      <div className="container mx-auto p-4 flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-10">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
            RecipeAI
          </span>
        </Link>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden flex items-center space-x-2">
          {isLoggedIn && !isAuthPage && username && (
             <span className="text-text-default text-base font-medium mr-2">Hello, {username}!</span>
          )}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-2 rounded-md text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop Navigation & User Info (Hidden on Mobile) */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          {/* Main Navigation Links */}
          <div className="flex items-center space-x-6 lg:space-x-8">
            {isAuthPage ? (
              // Specific links for Login/Register pages on Desktop
              isLoginPage ? ( // This is where `isLoginPage` is first used in the JSX
                <Link to="/register" className="text-lg font-semibold text-primary hover:text-primary-dark transition-colors duration-200">
                  Register
                </Link>
              ) : ( // isRegisterPage
                <Link to="/login" className="text-lg font-semibold text-primary hover:text-primary-dark transition-colors duration-200">
                  Login
                </Link>
              )
            ) : isLoggedIn ? (
              // Full navigation for logged-in users on Desktop
              <>
                <Link to="/" className="text-lg font-semibold text-primary hover:text-primary-dark transition-colors duration-200">
                  Home
                </Link>
                <Link to="/dashboard" className="text-lg font-semibold text-primary hover:text-primary-dark transition-colors duration-200">
                  My Recipes
                </Link>
                <Link to="/recipe-form" className="text-lg font-semibold text-primary hover:text-primary-dark transition-colors duration-200">
                  Generate
                </Link>
              </>
            ) : (
              // Links for non-logged-in users on desktop (e.g., Home page)
              <>
                <Link to="/login" className="text-lg font-semibold text-primary hover:text-primary-dark transition-colors duration-200">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-primary text-white text-md font-semibold rounded-md hover:bg-primary-dark transition-colors duration-200">
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* User Info and Logout Button for Desktop */}
          {isLoggedIn && !isAuthPage && username && (
            <div className="ml-8 flex items-center space-x-4">
              <span className="text-text-default text-lg font-medium">Hello, {username}!</span>
              <button onClick={handleLogout} className="px-4 py-2 bg-error-red text-white rounded-md hover:bg-red-600 transition-colors duration-200 font-semibold text-sm md:text-base">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu (Collapsible) */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} absolute top-full left-0 w-full bg-white shadow-lg pb-4 pt-2 border-t border-gray-200`}>
        <div className="flex flex-col items-start px-4 sm:px-6">
          {isAuthPage ? (
            // Specific links for Login/Register pages on Mobile
            isLoginPage ? ( // <--- This is where `isLoginPage` is used again
              <Link onClick={() => setIsMenuOpen(false)} to="/register" className="block w-full py-2 px-3 text-lg font-semibold text-primary hover:bg-gray-50 rounded-md">
                Register
              </Link>
            ) : ( // isRegisterPage
              <Link onClick={() => setIsMenuOpen(false)} to="/login" className="block w-full py-2 px-3 text-lg font-semibold text-primary hover:bg-gray-50 rounded-md">
                Login
              </Link>
            )
          ) : isLoggedIn ? (
            // Full navigation for logged-in users on Mobile
            <>
              <Link onClick={() => setIsMenuOpen(false)} to="/" className="block w-full py-2 px-3 text-lg font-semibold text-primary hover:bg-gray-50 rounded-md">
                Home
              </Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/dashboard" className="block w-full py-2 px-3 text-lg font-semibold text-primary hover:bg-gray-50 rounded-md">
                My Recipes
              </Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/recipe-form" className="block w-full py-2 px-3 text-lg font-semibold text-primary hover:bg-gray-50 rounded-md">
                Generate
              </Link>
              <button onClick={handleLogout} className="w-full text-left py-2 px-3 text-lg font-semibold text-error-red hover:bg-gray-50 rounded-md mt-2">
                Logout
              </button>
            </>
          ) : (
            // Links for non-logged-in users on mobile (e.g., Home page)
            <>
              <Link onClick={() => setIsMenuOpen(false)} to="/login" className="block w-full py-2 px-3 text-lg font-semibold text-primary hover:bg-gray-50 rounded-md">
                Login
              </Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/register" className="block w-full py-2 px-3 bg-primary text-white text-lg font-semibold rounded-md hover:bg-primary-dark">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;