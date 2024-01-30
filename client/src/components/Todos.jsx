import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import Header from './Header';
import SimpleMsg from './SimpleMsg';
import TextBtn from './TextBtn';
import RecipeCards from './recipes/RecipeCards';
import { deleteTodo, getTodos } from '../util/api';
import './Todos.css';

export default function Todos() {
  const { activeUser, todoSlugs, setTodoSlugs } = useContext(UserContext);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setTodos(await getTodos(activeUser.token));
      } catch (err) {
        console.log(err);
      }
    })();
  }, [todoSlugs]);

  const clearTodos = async () => {
    await Promise.all([
      todos.map((todo) => deleteTodo(activeUser.token, todo.slug)),
    ]);

    setTodoSlugs([]);
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
  else if (!todos.length > 0) {
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
            <RecipeCards recipes={todos} />

            <TextBtn
              text="Remove All..."
              size={3}
              callback={async () => {
                await clearTodos();
              }}
            />
          </div>
        </section>
      </>
    );
}
