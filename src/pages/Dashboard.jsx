import { useEffect, useState } from 'react';
import api from '../utils/api';
import RecipeCard from '../components/RecipeCard';

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // State for the new recipe form
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    ingredients: '', // Will be a string, split by newlines
    steps: '',       // Will be a string, split by newlines
  });
  const [formMessage, setFormMessage] = useState('');

  // Fetch user's recipes on component mount
  useEffect(() => {
    api.get('/recipes')
      .then((res) => {
        setRecipes(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError('Could not fetch recipes. Please try again later.');
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe({ ...newRecipe, [name]: value });
  };

  const handleSaveRecipe = async (e) => {
    e.preventDefault();
    setFormMessage('');

    if (!newRecipe.title || !newRecipe.ingredients || !newRecipe.steps) {
      setFormMessage('All fields are required.');
      return;
    }

    // Convert ingredients and steps from string to array
    const recipeData = {
      title: newRecipe.title,
      ingredients: newRecipe.ingredients.split('\n').filter(line => line.trim() !== ''),
      steps: newRecipe.steps.split('\n').filter(line => line.trim() !== ''),
    };

    try {
      const res = await api.post('/recipes', recipeData);
      // Add new recipe to the top of the list
      setRecipes([res.data, ...recipes]);
      // Clear the form
      setNewRecipe({ title: '', ingredients: '', steps: '' });
      setFormMessage('Recipe saved successfully!');
      setTimeout(() => setFormMessage(''), 3000); // Clear message after 3 seconds
    } catch (err) {
      setFormMessage('Failed to save recipe.');
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Add Recipe Form */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-28">
          <h2 className="text-3xl font-bold text-primary mb-4">Add a Recipe</h2>
          <form onSubmit={handleSaveRecipe}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-text-secondary font-semibold mb-2">Recipe Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newRecipe.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-border-light rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="e.g., Spaghetti Carbonara"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="ingredients" className="block text-text-secondary font-semibold mb-2">Ingredients (one per line)</label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={newRecipe.ingredients}
                onChange={handleInputChange}
                rows="5"
                className="w-full p-3 border border-border-light rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="200g Spaghetti&#10;100g Pancetta&#10;2 large eggs"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="steps" className="block text-text-secondary font-semibold mb-2">Steps (one per line)</label>
              <textarea
                id="steps"
                name="steps"
                value={newRecipe.steps}
                onChange={handleInputChange}
                rows="7"
                className="w-full p-3 border border-border-light rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="1. Boil water for pasta.&#10;2. Fry pancetta until crisp.&#10;3. Mix eggs and cheese."
              />
            </div>
            <button type="submit" className="w-full bg-secondary-btn text-white py-3 rounded-md hover:bg-secondary-btn-dark transition-colors font-semibold">
              Save Recipe
            </button>
            {formMessage && <p className="text-center mt-4 text-sm text-gray-600">{formMessage}</p>}
          </form>
        </div>
      </div>

      {/* Right Column: My Recipes List */}
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold text-primary mb-4">My Saved Recipes</h2>
        {isLoading ? (
          <p>Loading your recipes...</p>
        ) : error ? (
          <p className="text-error-red">{error}</p>
        ) : recipes.length > 0 ? (
          <div className="space-y-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 bg-white rounded-xl shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-text-default">No recipes yet!</h3>
            <p className="text-text-secondary mt-2">Use the form on the left to add your first recipe.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
