import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RecipeForm from './pages/RecipeForm';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component

const App = () => (
  <Router>
    <div className="flex flex-col min-h-screen bg-background-light font-sans text-text-default">
      <Navbar />

      <main className="flex-grow container mx-auto p-6 md:p-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/recipe-form" 
            element={
              <PrivateRoute>
                <RecipeForm />
              </PrivateRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  </Router>
);

export default App;
