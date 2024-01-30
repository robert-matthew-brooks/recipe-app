import { createContext, useEffect, useState } from 'react';
import { getFavourites, getTodos } from '../../util/api';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [activeUser, setActiveUser] = useState(null);
  const [favouriteSlugs, setFavouriteSlugs] = useState([]);
  const [todoSlugs, setTodoSlugs] = useState([]);

  const activateUser = async (userStr) => {
    if (!userStr) userStr = localStorage.getItem('user');

    if (userStr) {
      const activeUser = JSON.parse(userStr);
      setActiveUser(activeUser);
      try {
        setFavouriteSlugs((await getFavourites(activeUser.token)) || []);
        setTodoSlugs((await getTodos(activeUser.token)) || []);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const deactivateUser = () => {
    localStorage.clear();
    setActiveUser(null);
    setFavouriteSlugs([]);
    setTodoSlugs([]);
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
        favouriteSlugs,
        setFavouriteSlugs,
        todoSlugs,
        setTodoSlugs,
        activateUser,
        deactivateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
