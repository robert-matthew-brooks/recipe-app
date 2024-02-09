import { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import SimpleMsg from '../SimpleMsg';

export default function ProfileDeleted() {
  const { deactivateUser } = useContext(UserContext);

  useEffect(() => {
    deactivateUser();
  }, []);

  return (
    <SimpleMsg
      title="Profile deleted"
      msg="Your profile was deleted successfully"
      linkText="Back to Recipes..."
      linkHref="/recipes"
    />
  );
}
