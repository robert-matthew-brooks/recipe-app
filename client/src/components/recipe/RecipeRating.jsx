import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './RecipeRating.css';

export default function RecipeRating({
  votes,
  rating,
  userRating,
  setUserRating,
  optimisticVotes,
  setOptimisticVotes,
  optimisticRating,
  setOptimisticRating,
}) {
  const { activeUser } = useContext(UserContext);
  const [isSignedInErr, setIsSignedInErr] = useState(false);

  useEffect(() => {
    setOptimisticVotes(votes);
    setOptimisticRating(rating);
  }, [rating, votes]);

  const setRating = (numberOfStars) => {
    if (!activeUser) setIsSignedInErr(true);
    else {
      let optimisticStars = optimisticRating * optimisticVotes;
      let newOptimisticVotes = optimisticVotes;

      if (numberOfStars === userRating) {
        // removed rating
        optimisticStars -= numberOfStars;
        newOptimisticVotes -= 1;

        setUserRating(null);

        // delete api call
      } else {
        if (userRating) {
          // changed existing vote - remove current vote
          optimisticStars -= userRating;
          newOptimisticVotes -= 1;
        }
        // update new vote
        optimisticStars += numberOfStars;
        newOptimisticVotes += 1;

        setUserRating(numberOfStars);

        // post api call
      }
      setOptimisticVotes(newOptimisticVotes);
      setOptimisticRating(optimisticStars / newOptimisticVotes);
    }
  };

  return !isSignedInErr ? (
    <div className="RecipeRating__wrapper">
      <div className="RecipeRating" style={{ '--rating': optimisticRating }}>
        {(() => {
          const stars = [];

          for (let i = 1; i <= 5; i++) {
            stars.push(
              <a
                key={i}
                className={`RecipeRating__star ${
                  i === userRating ? 'RecipeRating__star--current' : ''
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
      <span className="RecipeRating__votes">
        {optimisticVotes || 'no'} rating{optimisticVotes === 1 ? '' : 's'}
      </span>
    </div>
  ) : (
    <p className="err">
      <Link to="/login">Sign in</Link> to leave a rating
    </p>
  );
}
