import { useEffect, useState } from 'react';
import { getRecipes } from '../../util/api';
import Header from '../Header';
import RecipeCards from './RecipeCards';
import RecipeFilter from './RecipeFilter';
import './Recipes.css';

export default function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterOrderBy, setFilterOrderBy] = useState('');
  const [filterIngredients, setFilterIngredients] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isErr, setIsErr] = useState(false); // TODO - string? contain err msg?

  useEffect(() => {
    (async () => {
      if (!isLoading) setIsLoading(true);
      try {
        setRecipes(
          await getRecipes(filterName, filterOrderBy, filterIngredients)
        );
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    })();
  }, [filterName, filterOrderBy, filterIngredients]);

  return (
    <>
      <Header title="Browse Recipes" />

      <section id="Recipes">
        <div id="Recipes--inner" className="inner">
          <RecipeFilter
            {...{
              filterName,
              setFilterName,
              filterOrderBy,
              setFilterOrderBy,
              filterIngredients,
              setFilterIngredients,
              setIsLoading,
            }}
          />
          {isLoading && 'loading'}
          {/* TODO proper loading screen/wheel */}

          {recipes.length > 0 ? (
            <RecipeCards {...{ recipes }} />
          ) : (
            <p>No recipes :(</p>
          )}
        </div>
      </section>
    </>
  );
}
