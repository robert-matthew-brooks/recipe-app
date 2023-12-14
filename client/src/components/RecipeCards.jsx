import RecipeCard from './RecipeCard';
import './RecipeCards.css';

export default function RecipeCards({ recipes }) {
  return (
    <div className="RecipeCards">
      {recipes.map((recipe, i) => {
        return <RecipeCard key={i} recipe={recipe} />;
      })}
    </div>
  );
}
