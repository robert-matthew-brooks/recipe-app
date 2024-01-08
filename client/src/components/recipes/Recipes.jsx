import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecipes } from '../../util/api';
import { UserContext } from '../context/UserContext';
import Header from '../Header';
import RecipeCards from './RecipeCards';
import RecipeFilter from './RecipeFilter';
import './Recipes.css';
import RecipePagination from './RecipePagination';

export default function AllRecipes() {
  const { activeUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
        filterIsFavourites,
        filterIsVegetarian,
        limit,
        page,
        activeUser?.token
      );
      setRecipes([...currentRecipes, ...fetchedRecipes]);
      setTotalRecipes(totalRecipes);
      setPage(page + 1);
    } catch (err) {
      console.log(err);
      navigate('/error');
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
            <p id="Recipes__none-msg">No recipes found &#9785;</p>
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
