import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRecipe } from '../../util/api';
import Header from '../Header';
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
    <>
      <Header title={recipe.name} />
      <p>Back to whatever...</p>

      <p>by {recipe.author}</p>

      <p>added {recipe.createdAt}</p>

      <img src={recipe.imgUrl} />
      {/* TODO placeholder */}

      <button>share website.com/recipes/{slug}</button>

      <button>Add to favourites</button>

      <p>Ingredients</p>
      <ol>
        {recipe.ingredients?.map((ingredient, i) => {
          return (
            <li key={`ingredient${i}`}>
              {ingredient.name} - {ingredient.amount}
              {ingredient.units}
            </li>
          );
        })}
      </ol>
      <p>Steps</p>
      <ol>
        {recipe.steps?.map((step, i) => {
          return <li key={`step${i}`}>{step}</li>;
        })}
      </ol>
      <button>Done (if on meal list)</button>

      <button>Like? {recipe.likes}</button>
      {/* TODO star rating? */}

      <p>Comments....</p>
    </>
  );
}
