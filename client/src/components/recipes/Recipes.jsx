import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecipes } from '../../util/api';
import { UserContext } from '../context/UserContext';
import Loading from '../Loading';
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

  const addRecipes = async (currentRecipes, page) => {
    if (!isLoading) setIsLoading(true);
    try {
      const { recipes: fetchedRecipes, totalRecipes } = await getRecipes({
        token: activeUser?.token,
        searchTerm: filterName,
        orderBy: filterOrderBy,
        ingredients: filterIngredients,
        isFavourites: filterIsFavourites,
        isVegetarian: filterIsVegetarian,
        limit,
        page,
      });
      setRecipes([...currentRecipes, ...fetchedRecipes]);
      setTotalRecipes(totalRecipes);
      setPage(page + 1);
    } catch (err) {
      console.log(err);
      navigate('/error');
    }
    setIsLoading(false);
  };

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

          <Loading isLoading={isLoading}>
            {recipes.length > 0 ? (
              <RecipeCards {...{ recipes }} />
            ) : (
              !isLoading && (
                <p id="Recipes__none-msg">No recipes found &#9785;</p>
              )
            )}
          </Loading>

          <RecipePagination
            recipesCount={recipes.length}
            totalRecipes={totalRecipes}
            callback={async () => {
              await addRecipes(recipes, page);
            }}
          ></RecipePagination>
        </div>
      </section>
    </>
  );
}
