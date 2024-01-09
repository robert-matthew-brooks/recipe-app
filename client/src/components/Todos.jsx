import { useContext } from 'react';
import { UserContext } from './context/UserContext';
import Header from './Header';
import './Todos.css';
import SimpleMsg from './SimpleMsg';
import { Link } from 'react-router-dom';

export default function Todos() {
  const { activeUser, todos, setTodos } = useContext(UserContext);

  // if not logged in, redirect

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
            <ul>
              {todos.map((todo, i) => {
                return (
                  <li key={i}>
                    <Link to={`/recipes/${todo}`}>{todo}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </>
    );
}
