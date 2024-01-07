import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import RecipeButtons from './RecipeButtons';
import { getRecipe } from '../../util/api';
import { getShortDate } from '../../util/date';
import recipePlaceholderImg from '../../assets/recipe-placeholder.jpeg';
import './Recipe.css';

export default function Recipe() {
  const navigate = useNavigate();
  const { recipe_slug: slug } = useParams();
  const [recipe, setRecipe] = useState({});

  useEffect(() => {
    (async () => {
      // TODO set loading

      try {
        setRecipe(await getRecipe(slug));
      } catch (err) {
        if (err.response?.data?.status === 404) {
          navigate('404');
        } else {
          console.log(err);
          // TODO handle err with error state / message
        }
      }
    })();
  }, [slug]);

  return (
    <article id="Recipe">
      <div id="Recipe__inner" className="inner">
        <div id="Recipe__backlink">
          <Link to="/recipes">&larr; Back to Recipes...</Link>
        </div>

        <h1 className="Recipe__title">{recipe.name}</h1>

        <p id="Recipe__author">
          added by <span id="Recipe__author--bold">{recipe.author}</span>
          on {getShortDate(recipe.createdAt)}
        </p>

        <RecipeButtons slug={recipe.slug} />

        <div
          id="Recipe__image"
          style={{
            backgroundImage: `url('${recipe.imgUrl || recipePlaceholderImg}')`,
          }}
        ></div>

        <div id="Recipe__row-wrapper">
          <section id="Recipe__ingredients" className="Recipe__list">
            <h2>Ingredients</h2>
            <ul>
              {recipe.ingredients?.map((ingredient, i) => {
                return (
                  <li key={`ingredient${i}`}>
                    {ingredient.name} - {ingredient.amount}
                    {ingredient.units}
                  </li>
                );
              })}
            </ul>
          </section>

          <section id="Recipe__steps" className="Recipe__list">
            <h2>Instructions</h2>
            <ol>
              {recipe.steps?.map((step, i) => {
                return <li key={`step${i}`}>{step}</li>;
              })}
            </ol>
          </section>
        </div>

        <RecipeButtons slug={recipe.slug} />

        <button>Done (if on meal list)</button>

        <button>Like? {recipe.likes}</button>
        {/* TODO star rating? */}

        <hr />

        <section>
          <h1 className="Recipe__title">Comments</h1>
        </section>
      </div>
    </article>
  );
}
