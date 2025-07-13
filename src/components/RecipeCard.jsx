const RecipeCard = ({ recipe }) => {
    // Destructure with default values to prevent errors if recipe is null
    const { title = 'No Title', ingredients = [], steps = [], image } = recipe || {};
  
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-2xl duration-300 border border-gray-200">
        {/* Conditionally render image if it exists */}
        {image && (
          <img 
            className="w-full h-48 object-cover" 
            src={image} 
            alt={`Image of ${title}`} 
            onError={(e) => { e.target.style.display = 'none'; }} // Hide if image fails to load
          />
        )}
        
        <div className="p-6">
          <h3 className="text-2xl font-bold text-primary mb-3">{title}</h3>
          
          {/* Ingredients Section */}
          <div className="mb-4">
            <h4 className="font-semibold text-lg text-gray-800 mb-2">Ingredients:</h4>
            <ul className="list-disc list-inside space-y-1 text-text-secondary">
              {ingredients.map((item, index) => (
                <li key={`ing-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
  
          {/* Steps Section */}
          {steps && steps.length > 0 && (
            <div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-text-secondary">
                {steps.map((step, index) => (
                  <li key={`step-${index}`}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default RecipeCard;
  