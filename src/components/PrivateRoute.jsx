import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');

  // If the user is authenticated, render the child components (the protected page).
  // Otherwise, redirect them to the login page.
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
