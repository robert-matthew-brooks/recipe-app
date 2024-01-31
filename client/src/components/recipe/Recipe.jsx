import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Loading from '../Loading';
import RecipeButtons from './RecipeButtons';
import RecipeRating from './RecipeRating';
import { getRating, getRecipe } from '../../util/api';
import { getShortDate } from '../../util/date';
import recipePlaceholderImg from '../../assets/recipe-placeholder.jpeg';
import './Recipe.css';

export default function Recipe() {
  const navigate = useNavigate();
  const { activeUser } = useContext(UserContext);
  const { recipe_slug: slug } = useParams();
  const [recipe, setRecipe] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [userRating, setUserRating] = useState(null);
  const [optimisticVotes, setOptimisticVotes] = useState(0);
  const [optimisticRating, setOptimisticRating] = useState(0);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const recipe = await getRecipe(slug);
        if (activeUser) {
          setUserRating(await getRating(activeUser.token, slug));
        }

        setRecipe(recipe);
        setOptimisticVotes(recipe.votes);
        setOptimisticRating(recipe.rating);
      } catch (err) {
        if (err.response?.data?.status === 404) {
          navigate('/404');
        } else {
          console.log(err);
          navigate('/error');
        }
      }
      setIsLoading(false);
    })();
  }, [slug]);

  return (
    <article id="Recipe">
      <div id="Recipe__inner" className="inner">
        <div id="Recipe__backlink">
          <Link to="/recipes">&larr; Back to Recipes...</Link>
        </div>

        <Loading isLoading={isLoading}>
          <div id="Recipe__wrapper">
            <h1 className="Recipe__title">{recipe.name}</h1>

            {!isLoading && (
              <p id="Recipe__author">
                added by <span className="bold">{recipe.author}</span>
                &nbsp;&nbsp;&nbsp;on {getShortDate(recipe.createdAt)}
              </p>
            )}

            <RecipeButtons slug={recipe.slug} name={recipe.name} />
            <RecipeRating
              slug={recipe.slug}
              votes={recipe.votes}
              rating={recipe.rating}
              {...{
                userRating,
                setUserRating,
                optimisticVotes,
                setOptimisticVotes,
                optimisticRating,
                setOptimisticRating,
              }}
            />

            <div
              id="Recipe__image"
              style={{
                backgroundImage: `url('${
                  recipe.imgUrl || recipePlaceholderImg
                }')`,
              }}
            ></div>

            {!isLoading && (
              <div id="Recipe__row-wrapper">
                <section id="Recipe__ingredients" className="Recipe__list">
                  <h2>Ingredients</h2>
                  <ul>
                    {recipe.ingredients?.map((ingredient, i) => {
                      return (
                        <li key={`ingredient${i}`}>
                          {ingredient.name} -{' '}
                          <span className="bold">
                            {ingredient.amount}
                            {ingredient.units}
                          </span>
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
            )}

            <RecipeButtons slug={recipe.slug} name={recipe.name} />
            <RecipeRating
              slug={recipe.slug}
              votes={recipe.votes}
              rating={recipe.rating}
              {...{
                userRating,
                setUserRating,
                optimisticVotes,
                setOptimisticVotes,
                optimisticRating,
                setOptimisticRating,
              }}
            />

            <hr />

            <section>
              <h1 className="Recipe__title">Comments</h1>
            </section>
          </div>
        </Loading>
      </div>
    </article>
  );
}
