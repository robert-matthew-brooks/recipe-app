import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { deleteRating, putRating } from '../../util/api';
import './RecipeRating.css';

export default function RecipeRating({
  slug,
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
  const [isErr, setIsErr] = useState(false);

  useEffect(() => {
    setOptimisticVotes(votes);
    setOptimisticRating(rating);
  }, [rating, votes]);

  const handleRatingClick = async (clickedRating) => {
    if (!activeUser) setIsSignedInErr(true);
    else {
      let optimisticTotalStars = optimisticRating * optimisticVotes;
      let newOptimisticVotes = optimisticVotes;

      if (clickedRating === userRating) {
        // remove rating
        optimisticTotalStars -= clickedRating;
        newOptimisticVotes -= 1;
        setUserRating(null);

        setOptimisticVotes(newOptimisticVotes);
        setOptimisticRating(optimisticTotalStars / newOptimisticVotes || 0);

        try {
          await deleteRating(slug, activeUser.token);
        } catch (err) {
          console.log(err);
          setIsErr(true);
        }
      } else {
        if (userRating) {
          // remove existing vote
          optimisticTotalStars -= userRating;
          newOptimisticVotes -= 1;
        }
        // add new vote
        optimisticTotalStars += clickedRating;
        newOptimisticVotes += 1;
        setUserRating(clickedRating);

        setOptimisticVotes(newOptimisticVotes);
        setOptimisticRating(optimisticTotalStars / newOptimisticVotes || 0);

        try {
          await putRating(slug, activeUser.token, clickedRating);
        } catch (err) {
          console.log(err);
          setIsErr(true);
        }
      }
    }
  };

  if (isSignedInErr)
    return (
      <p className="err">
        <Link to="/login">Sign in</Link> to leave a rating
      </p>
    );
  else if (isErr)
    return <p className="err">Something went wrong. Please try again later</p>;
  else
    return (
      <div className="RecipeRating__wrapper">
        <div
          className="RecipeRating"
          style={{ '--rating': optimisticRating || 0 }}
        >
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
                    handleRatingClick(i);
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
    );
}
