import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import Header from './Header';
import RecipeCards from './recipes/RecipeCards';
import RecipePagination from './recipes/RecipePagination';
import SimpleMsg from './SimpleMsg';
import TextBtn from './TextBtn';
import { getRecipes, deleteTodo } from '../util/api';
import './Todos.css';

export default function Todos() {
  const { activeUser, setTodoSlugs } = useContext(UserContext);
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const limit = 6;
  const [page, setPage] = useState(1);

  const addRecipes = async (currentRecipes, page) => {
    if (!isLoading) setIsLoading(true);
    try {
      const { recipes: fetchedRecipes, totalRecipes } = await getRecipes({
        token: activeUser?.token,
        isTodos: true,
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
      if (activeUser?.token) {
        addRecipes([], 1);
      }
    })();
  }, [activeUser]);

  const clearTodos = async () => {
    await Promise.all([
      recipes.map((recipe) => deleteTodo(activeUser.token, recipe.slug)),
    ]);

    setTodoSlugs([]);
    setRecipes([]);
  };

  if (!activeUser)
    return (
      <SimpleMsg
        title="My Meal List"
        msg="Please sign in to create your meal list"
        linkText="OK, Sign Me In!"
        linkHref="/login"
      />
    );
  else if (!recipes?.length > 0) {
    return (
      <SimpleMsg
        title="My Meal List"
        msg="Empty... add some recipes to your meal list!"
        linkText="Browse Recipes"
        linkHref="/recipes"
      />
    );
  } else
    return (
      <>
        <Header title="My Meal List" />

        <section id="Todos">
          <div id="Todos__inner" className="inner">
            <RecipeCards recipes={recipes} />

            <RecipePagination
              recipesCount={recipes.length}
              totalRecipes={totalRecipes}
              callback={async () => {
                await addRecipes(recipes, page);
              }}
            >
              <TextBtn
                text="Remove All..."
                size={3}
                callback={async () => {
                  await clearTodos();
                }}
              />
            </RecipePagination>
          </div>
        </section>
      </>
    );
}
