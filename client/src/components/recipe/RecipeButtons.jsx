import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import TextBtn from '../TextBtn';
import './RecipeButtons.css';

export default function RecipeButtons({ slug, name }) {
  const { activeUser } = useContext(UserContext);
  const [isSignedInErr, setIsSignedInErr] = useState(false);

  const addToFavourites = () => {
    if (!activeUser) setIsSignedInErr(true);
    else {
      // TODO add to user favs
      console.log('do something');
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
          <TextBtn
            text="Add to Favourites"
            size="2"
            callback={addToFavourites}
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
