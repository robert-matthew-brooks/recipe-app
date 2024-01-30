import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import Header from './Header';
import SimpleMsg from './SimpleMsg';
import TextBtn from './TextBtn';
import { deleteTodo, getTodoDetails } from '../util/api';
import recipePlaceholderImg from '../assets/recipe-placeholder.jpeg';
import './Todos.css';

export default function Todos() {
  const { activeUser, todoSlugs, setTodoSlugs } = useContext(UserContext);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setTodos(await getTodoDetails(todoSlugs));
      } catch (err) {
        console.log(err);
      }
    })();
  }, [todoSlugs]);

  const clearTodos = async () => {
    await Promise.all([
      todoSlugs.map((todo) => deleteTodo(activeUser.token, todo)),
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
  else if (todos.length === 0) {
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
            <ul id="Todos__list">
              {todos.recipes?.map((todo, i) => {
                return (
                  <Link key={i} to={`/recipes/${todo.slug}`}>
                    <li className="Todos__card">
                      <img
                        src={todo.imgUrl || recipePlaceholderImg}
                        height="100px"
                      />
                      {todo.name}
                    </li>
                  </Link>
                );
              })}
            </ul>

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
