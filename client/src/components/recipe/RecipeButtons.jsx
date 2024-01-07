import { useState } from 'react';
import { Link } from 'react-router-dom';
import TextBtn from '../TextBtn';
import './RecipeButtons.css';

export default function RecipeButtons({ slug }) {
  const [isFavUserErr, setIsFavUserErr] = useState(false);

  const addToFavourites = () => {
    // TODO check user logged in from context
    setIsFavUserErr(true);
  };

  return (
    <div className="RecipeButtons">
      <TextBtn
        light={true}
        text="Share via Email"
        size="2"
        callback={() => {
          console.log(` website.com/recipes/${slug}`);
        }}
      />

      {!isFavUserErr ? (
        <TextBtn text="Add to Favourites" size="2" callback={addToFavourites} />
      ) : (
        <p className="err">
          <Link to="/login">Sign in</Link> to use favourites
        </p>
      )}
      {/* TODO remove from favourites if already added */}
      {/* or show error if not signed in */}
    </div>
  );
}
