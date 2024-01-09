import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import TextBtn from '../TextBtn';
import {
  deleteFavourite,
  deleteTodo,
  putFavourite,
  putTodo,
} from '../../util/api';
import './RecipeButtons.css';

export default function RecipeButtons({ slug, name }) {
  const { activeUser, favourites, setFavourites, todos, setTodos } =
    useContext(UserContext);
  const [isSignedInErr, setIsSignedInErr] = useState(false);

  const handleFavouritesClick = async () => {
    if (!activeUser) setIsSignedInErr(true);
    else {
      if (favourites.includes(slug)) {
        setFavourites(favourites.filter((el) => el !== slug));
        await deleteFavourite(activeUser?.token, slug);
      } else {
        setFavourites([...favourites, slug]);
        await putFavourite(activeUser?.token, slug);
      }
    }
  };

  const handleTodosClick = async () => {
    if (!activeUser) setIsSignedInErr(true);
    else {
      if (todos.includes(slug)) {
        setTodos(todos.filter((el) => el !== slug));
        await deleteTodo(activeUser?.token, slug);
      } else {
        setTodos([...todos, slug]);
        await putTodo(activeUser?.token, slug);
      }
    }
  };

  return (
    <>
      <div className="RecipeButtons">
        <TextBtn
          light={true}
          text="Share via Email"
          size="2"
          callback={() => {
            window.location.href = `mailto:?subject=${name}&body=${window.location.href}`;
          }}
        />

        {!isSignedInErr ? (
          <>
            <TextBtn
              text={
                favourites.includes(slug)
                  ? 'Remove from Favourites'
                  : 'Add to Favourites'
              }
              size="2"
              callback={handleFavouritesClick}
            />
            <TextBtn
              text={
                todos.includes(slug)
                  ? 'Remove from Meal List'
                  : 'Add to Meal List'
              }
              size="2"
              callback={handleTodosClick}
            />
          </>
        ) : (
          <p className="err">
            <Link to="/login">Sign in</Link> to use favourites
          </p>
        )}
      </div>
    </>
  );
}
