import { useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import Header from './Header';

export default function AuthLogout() {
  const { setActiveUser } = useContext(UserContext);

  useEffect(() => {
    localStorage.clear();
    setActiveUser(null);
  }, []);

  return (
    <>
      <Header title="Logged Out" />
      Logging out...
    </>
  );
}
