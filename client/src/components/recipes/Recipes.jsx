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

  // TODO replace this single call with dynamic call below
  useEffect(() => {
    (async () => {
      setRecipes(await getRecipes());
    })();
  }, []);

  // TODO
  useEffect(() => {
    console.log('show loading');
    const getRecipesDebounce = setTimeout(() => {
      console.log('changed', filterName, filterOrderBy, filterIngredients);
      console.log('hide loading');
    }, 1000);

    return () => {
      clearTimeout(getRecipesDebounce);
    };
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
            }}
          />
          <RecipeCards {...{ recipes }} />
        </div>
      </section>
    </>
  );
}
