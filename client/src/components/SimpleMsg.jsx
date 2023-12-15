import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import Header from './Header';
import './SimpleMsg.css';

export default function SimpleMsg({ title, msg, linkText, linkHref }) {
  const { setActiveUser } = useContext(UserContext);

  useEffect(() => {
    localStorage.clear();
    setActiveUser(null);
  }, []);

  return (
    <>
      <Header title={title} />
      <section id="SimpleMsg">
        <div id="SimpleMsg--inner" className="inner">
          <p className="SimpleMsg--text">{msg}</p>
          <Link to={linkHref}>{linkText}</Link>
        </div>
      </section>
    </>
  );
}
