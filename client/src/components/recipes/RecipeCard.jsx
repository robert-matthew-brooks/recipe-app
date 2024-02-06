import { Link, useLocation } from 'react-router-dom';
import recipePlaceholderImg from '../../assets/recipe-placeholder.jpeg';
import './RecipeCard.css';

export default function RecipeCard({ recipe }) {
  const location = useLocation();

  return (
    <div className="RecipeCard">
      <Link to={`/recipes/${recipe.slug}?from=${location.pathname}`}>
        <div
          className="RecipeCard__img-box"
          style={{
            backgroundImage: `url('${recipe.imgUrl || recipePlaceholderImg}')`,
          }}
        ></div>
        <h3 className="RecipeCard__title">{recipe.name}</h3>
        <p className="RecipeCard__author">by {recipe.author}</p>
      </Link>
    </div>
  );
}
