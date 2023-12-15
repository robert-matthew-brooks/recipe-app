import recipePlaceholderImg from '../assets/recipe-placeholder.jpeg';
import './RecipeCard.css';

export default function RecipeCard({ recipe }) {
  return (
    <div className="RecipeCard">
      <div
        className="RecipeCard--img-box"
        style={{
          backgroundImage: `url('${recipe.imgUrl || recipePlaceholderImg}')`,
        }}
      ></div>
      <h3 className="RecipeCard--title">{recipe.name}</h3>
      <p className="RecipeCard--author">by {recipe.author}</p>
    </div>
  );
}
