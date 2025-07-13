import { useState } from 'react';
import api from '../utils/api';

// --- SVG Icons (Embedded to avoid external dependencies) ---
const Sparkles = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 3-1.9 4.8-4.8 1.9 4.8 1.9 1.9 4.8 1.9-4.8 4.8-1.9-4.8-1.9Z"/>
    <path d="M5 21v-3"/><path d="M19 21v-3"/><path d="M3 12H0"/><path d="M21 12h3"/>
    <path d="m5 3-3 3"/><path d="m19 3 3 3"/>
  </svg>
);
const UtensilsCrossed = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/>
    <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/>
    <path d="m2.1 21.8 6.4-6.3"/><path d="m19 5-7 7"/>
  </svg>
);
const Leaf = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M11 20A7 7 0 0 1 4 13H2a10 10 0 0 0 10 10z"/>
    <path d="M22 4a10 10 0 0 0-10-2H4a7 7 0 0 1 7 7z"/>
  </svg>
);

// --- Recipe Detail Modal Component ---
const RecipeDetailModal = ({ recipe, onClose }) => {
  if (!recipe) return null;

  // Function to safely render HTML content from the API
  const createMarkup = (htmlString) => {
    return { __html: htmlString || 'No instructions provided.' };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-primary">{recipe.title}</h2>
        </div>
        <div className="p-6 overflow-y-auto">
          <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded-lg mb-4" />
          <h3 className="font-semibold text-xl text-gray-800 mb-2">Ingredients:</h3>
          <ul className="list-disc list-inside space-y-1 text-text-secondary mb-4">
            {recipe.extendedIngredients.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
          <h3 className="font-semibold text-xl text-gray-800 mb-2">Instructions:</h3>
          {/* Using dangerouslySetInnerHTML to render HTML instructions from Spoonacular */}
          <div className="prose max-w-none text-text-secondary" dangerouslySetInnerHTML={createMarkup(recipe.instructions)} />
        </div>
        <div className="p-4 bg-gray-50 border-t rounded-b-2xl flex justify-end">
          <button onClick={onClose} className="bg-gray-200 text-text-default px-6 py-2 rounded-md hover:bg-gray-300 transition-colors font-semibold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Generated Recipe Card Component ---
const GeneratedRecipeCard = ({ recipe, onClick }) => (
  <div onClick={onClick} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-2xl duration-300 border border-gray-200 cursor-pointer">
    <img className="w-full h-48 object-cover" src={recipe.image} alt={`Image of ${recipe.title}`} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/EEE/31343C?text=Image+Not+Found'; }} />
    <div className="p-6">
      <h3 className="text-xl font-bold text-primary mb-3">{recipe.title}</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center text-green-700"><Leaf className="h-4 w-4 mr-2 flex-shrink-0" /><span><span className="font-semibold">{recipe.usedIngredients.length}</span> ingredients you have</span></div>
        <div className="flex items-center text-amber-700"><UtensilsCrossed className="h-4 w-4 mr-2 flex-shrink-0" /><span><span className="font-semibold">{recipe.missedIngredients.length}</span> extra ingredients needed</span></div>
      </div>
    </div>
  </div>
);

// --- Main Recipe Form Page Component ---
const RecipeForm = () => {
  const [ingredients, setIngredients] = useState('');
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for the modal
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setGeneratedRecipes([]);
    try {
      const res = await api.post('/recipes/generate', {
        ingredients: ingredients.split(',').map(i => i.trim()).filter(i => i),
      });
      setGeneratedRecipes(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate recipes.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = async (recipeId) => {
    setIsModalLoading(true);
    setError('');
    try {
      const res = await api.get(`/recipes/${recipeId}`);
      setSelectedRecipe(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch recipe details.');
    } finally {
      setIsModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Modal for Recipe Details */}
      <RecipeDetailModal recipe={selectedRecipe} onClose={closeModal} />
      
      {/* Form Section */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-8">
        <div className="flex items-center mb-4">
          <Sparkles className="h-8 w-8 text-primary mr-3" />
          <h2 className="text-3xl font-bold text-primary">AI Recipe Generator</h2>
        </div>
        <p className="text-text-secondary mb-6">Enter ingredients you have, separated by commas, and let AI find recipes for you.</p>
        <form onSubmit={handleGenerate}>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              className="flex-grow w-full p-4 border border-border-light rounded-md focus:ring-2 focus:ring-primary focus:outline-none text-lg" 
              placeholder="e.g., chicken, broccoli, rice" 
              value={ingredients} 
              onChange={(e) => setIngredients(e.target.value)} 
            />
            <button 
              type="submit" 
              className="bg-primary text-white py-4 px-8 rounded-md hover:bg-primary-dark transition-colors font-semibold text-lg flex items-center justify-center" 
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Recipes'}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {error && <p className="text-center text-error-red bg-red-100 p-3 rounded-md">{error}</p>}
      
      {/* Show loading indicators */}
      {isModalLoading && <p className="text-center text-lg text-text-secondary">Loading recipe details...</p>}
      {isLoading && !isModalLoading && <p className="text-center text-lg text-text-secondary">Finding delicious recipes for you...</p>}
      
      {generatedRecipes.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-primary mb-4 text-center">Here are your recipe suggestions!</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedRecipes.map((recipe) => (
              <GeneratedRecipeCard key={recipe.id} recipe={recipe} onClick={() => handleCardClick(recipe.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeForm;
