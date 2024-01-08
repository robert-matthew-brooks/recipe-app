import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import TextBtn from '../TextBtn';
import { deleteFavourite, putFavourite } from '../../util/api';
import './RecipeButtons.css';

export default function RecipeButtons({ slug, name }) {
  const { activeUser, favourites, setFavourites } = useContext(UserContext);
  const [isSignedInErr, setIsSignedInErr] = useState(false);

  const handleFavouritesClick = async () => {
    // TODO loading wheel
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
    // TODO end loading
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
            <TextBtn text="Add to Meal List" size="2" callback={() => {}} />
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
