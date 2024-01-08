import { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import SimpleMsg from '../SimpleMsg';

export default function AuthLogout() {
  const { deactivateUser } = useContext(UserContext);

  useEffect(() => {
    deactivateUser();
  }, []);

  return (
    <SimpleMsg
      title="Signed Out"
      msg="Hope to see you again soon!"
      linkText="Back to Recipes"
      linkHref="/recipes"
    />
  );
}
