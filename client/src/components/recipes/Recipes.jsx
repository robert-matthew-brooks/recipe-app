import { useContext, useEffect, useState } from 'react';
import { getRecipes } from '../../util/api';
import { UserContext } from '../context/UserContext';
import Header from '../Header';
import RecipeCards from './RecipeCards';
import RecipeFilter from './RecipeFilter';
import './Recipes.css';
import RecipePagination from './RecipePagination';

export default function AllRecipes() {
  const { activeUser } = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isErr, setIsErr] = useState(false); // TODO - string? contain err msg?

  const [filterName, setFilterName] = useState('');
  const [filterOrderBy, setFilterOrderBy] = useState('');
  const [filterIngredients, setFilterIngredients] = useState([]);
  const [filterIsFavourites, setFilterIsFavourites] = useState(false);
  const [filterIsVegetarian, setFilterIsVegetarian] = useState(false);
  const limit = 6;
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      addRecipes([], 1);
    })();
  }, [
    filterName,
    filterOrderBy,
    filterIngredients,
    filterIsFavourites,
    filterIsVegetarian,
  ]);

  const addRecipes = async (currentRecipes, page) => {
    if (!isLoading) setIsLoading(true);
    try {
      const { recipes: fetchedRecipes, totalRecipes } = await getRecipes(
        filterName,
        filterOrderBy,
        filterIngredients,
        filterIsFavourites ? activeUser?.token : null, // pass user token to get favourites from
        filterIsVegetarian,
        limit,
        page
      );
      setRecipes([...currentRecipes, ...fetchedRecipes]);
      setTotalRecipes(totalRecipes);
      setPage(page + 1);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Header title="Browse Recipes" />

      <section id="Recipes">
        <div id="Recipes__inner" className="inner">
          <RecipeFilter
            {...{
              filterName,
              setFilterName,
              filterOrderBy,
              setFilterOrderBy,
              filterIngredients,
              setFilterIngredients,
              filterIsFavourites,
              setFilterIsFavourites,
              filterIsVegetarian,
              setFilterIsVegetarian,
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

          <RecipePagination
            recipesCount={recipes.length}
            totalRecipes={totalRecipes}
            callback={() => {
              addRecipes(recipes, page);
            }}
            isLoading={isLoading}
          />
        </div>
      </section>
    </>
  );
}
