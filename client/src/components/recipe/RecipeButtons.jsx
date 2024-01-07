import { useState } from 'react';
import { Link } from 'react-router-dom';
import TextBtn from '../TextBtn';
import './RecipeButtons.css';

export default function RecipeButtons({ slug }) {
  const [userRating, setUserRating] = useState(1);
  const [isFavUserErr, setIsFavUserErr] = useState(false);

  const addToFavourites = () => {
    // TODO check user logged in from context
    setIsFavUserErr(true);
  };

  const setRating = (numberOfStars) => {
    if (numberOfStars === userRating) setUserRating(null);
    else setUserRating(numberOfStars);

    // update server
  };

  return (
    <div className="RecipeButtons">
      <TextBtn
        light={true}
        text="Share via Email"
        size="2"
        callback={() => {
          console.log(window.location.href);
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

      <div className="Rating" style={{ '--rating': 2.5 }}>
        {(() => {
          const stars = [];

          for (let i = 0; i < 5; i++) {
            stars.push(
              <a
                key={i}
                className={`Rating__star ${
                  i === userRating ? 'Rating__star--current' : ''
                }`}
                onClick={() => {
                  setRating(i);
                }}
              >
                &#9734;
              </a>
            );
          }

          return stars;
        })()}
      </div>
    </div>
  );
}
