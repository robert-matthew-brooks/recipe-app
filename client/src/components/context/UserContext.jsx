import { createContext, useEffect, useState } from 'react';
import { getFavourites, getTodos } from '../../util/api';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [activeUser, setActiveUser] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [todos, setTodos] = useState([]);

  const activateUser = async (userStr) => {
    if (!userStr) userStr = localStorage.getItem('user');

    if (userStr) {
      const activeUser = JSON.parse(userStr);
      setActiveUser(activeUser);
      try {
        setFavourites((await getFavourites(activeUser.token)) || []);
        setTodos((await getTodos(activeUser.token)) || []);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const deactivateUser = () => {
    localStorage.clear();
    setActiveUser(null);
    setFavourites([]);
    setTodos([]);
  };

  useEffect(() => {
    (async () => {
      await activateUser();
    })();
  }, []);

  return (
    <UserContext.Provider
      value={{
        activeUser,
        setActiveUser,
        favourites,
        setFavourites,
        todos,
        setTodos,
        activateUser,
        deactivateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
