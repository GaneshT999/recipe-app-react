import { Link } from 'react-router-dom';

const Home = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="text-center flex flex-col items-center justify-center flex-grow">
      <div className="bg-white/90 p-10 md:p-16 rounded-2xl shadow-2xl max-w-4xl mx-auto backdrop-blur-sm border border-gray-200">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-4">
          Welcome to RecipeAI
        </h1>
        <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
          Discover your next favorite meal! Use the power of AI to generate unique recipes from the ingredients you already have.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          {isLoggedIn ? (
            <Link
              to="/recipe-form"
              className="px-8 py-3 bg-primary text-white text-lg font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-transform transform hover:scale-105 duration-300"
            >
              Generate a New Recipe
            </Link>
          ) : (
            <Link
              to="/register"
              className="px-8 py-3 bg-primary text-white text-lg font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-transform transform hover:scale-105 duration-300"
            >
              Get Started for Free
            </Link>
          )}
          <Link
            to="/dashboard"
            className="px-8 py-3 bg-gray-200 text-text-default text-lg font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-transform transform hover:scale-105 duration-300"
          >
            View My Recipes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
