import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import TextBtn from '../TextBtn';
import {
  deleteFavourite,
  deleteTodo,
  putFavourite,
  putTodo,
} from '../../util/api';
import './RecipeButtons.css';

export default function RecipeButtons({ slug, name, author }) {
  const {
    activeUser,
    favouriteSlugs,
    setFavouriteSlugs,
    todoSlugs,
    setTodoSlugs,
  } = useContext(UserContext);
  const navigate = useNavigate();
  const [isSignedInErr, setIsSignedInErr] = useState(false);

  const handleFavouritesClick = async () => {
    if (!activeUser) setIsSignedInErr(true);
    else {
      if (favouriteSlugs.includes(slug)) {
        setFavouriteSlugs(favouriteSlugs.filter((el) => el !== slug));
        await deleteFavourite(activeUser?.token, slug);
      } else {
        setFavouriteSlugs([...favouriteSlugs, slug]);
        await putFavourite(activeUser?.token, slug);
      }
    }
  };

  const handleTodosClick = async () => {
    if (!activeUser) setIsSignedInErr(true);
    else {
      if (todoSlugs.includes(slug)) {
        setTodoSlugs(todoSlugs.filter((el) => el !== slug));
        await deleteTodo(activeUser?.token, slug);
      } else {
        setTodoSlugs([...todoSlugs, slug]);
        await putTodo(activeUser?.token, slug);
      }
    }
  };

  return (
    <>
      <div className="RecipeButtons">
        <TextBtn
          style="light"
          text="Share via Email"
          size="2"
          callback={() => {
            window.location.href = `mailto:?subject=${encodeURIComponent(
              name
            )}&body=${window.location.href.split('?')[0]}`;
          }}
        />

        {!isSignedInErr ? (
          <>
            <TextBtn
              text={
                favouriteSlugs.includes(slug)
                  ? 'Remove from Favourites'
                  : 'Add to Favourites'
              }
              style={favouriteSlugs.includes(slug) ? 'inverted' : 'dark'}
              size="2"
              callback={handleFavouritesClick}
            />
            <TextBtn
              text={
                todoSlugs.includes(slug)
                  ? 'Remove from Meal List'
                  : 'Add to Meal List'
              }
              style={todoSlugs.includes(slug) ? 'inverted' : 'dark'}
              size="2"
              callback={handleTodosClick}
            />
          </>
        ) : (
          <p className="err">
            <Link to="/login">Sign in</Link> to use favourites
          </p>
        )}

        {activeUser?.username === author && (
          <TextBtn
            text="Edit..."
            style="danger"
            size="2"
            callback={() => navigate(`/edit-recipe?slug=${slug}`)}
          />
        )}
      </div>
    </>
  );
}
