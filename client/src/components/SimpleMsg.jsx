import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import Header from './Header';
import TextBtn from './TextBtn';
import './SimpleMsg.css';

export default function SimpleMsg({ title, msg, linkText, linkHref }) {
  const navigate = useNavigate();
  const { setActiveUser } = useContext(UserContext);

  useEffect(() => {
    localStorage.clear();
    setActiveUser(null);
  }, []);

  return (
    <>
      <Header title={title} />
      <section id="SimpleMsg">
        <div id="SimpleMsg__inner" className="inner">
          <p className="SimpleMsg__text">{msg}</p>
          <TextBtn
            text={linkText}
            size={3}
            cb={() => {
              navigate(linkHref);
            }}
          />
        </div>
      </section>
    </>
  );
}
