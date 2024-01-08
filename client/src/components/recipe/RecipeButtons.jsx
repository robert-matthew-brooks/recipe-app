import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import TextBtn from '../TextBtn';
import { putFavourite } from '../../util/api';
import './RecipeButtons.css';

export default function RecipeButtons({ slug, name }) {
  const { activeUser, favourites, setFavourites } = useContext(UserContext);
  const [isSignedInErr, setIsSignedInErr] = useState(false);

  const handleFavouritesClick = async () => {
    // TODO loading wheel
    if (!activeUser) setIsSignedInErr(true);
    else {
      //TODO update favourites context
      console.log();
      await putFavourite(activeUser?.token, slug);
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
          <TextBtn
            text={
              favourites.includes(slug)
                ? 'Remove from Favourites'
                : 'Add to Favourites'
            }
            size="2"
            callback={handleFavouritesClick}
          />
        ) : (
          <p className="err">
            <Link to="/login">Sign in</Link> to use favourites
          </p>
        )}
        {/* TODO remove from favourites if already added */}
        {/* or show error if not signed in */}
      </div>
    </>
  );
}
