import { useNavigate } from 'react-router-dom';
import Header from './Header';
import TextBtn from './TextBtn';
import './SimpleMsg.css';

export default function SimpleMsg({ title, msg, linkText, linkHref }) {
  const navigate = useNavigate();

  return (
    <>
      <Header title={title} />
      <section id="SimpleMsg">
        <div id="SimpleMsg__inner" className="inner">
          <p className="SimpleMsg__text">{msg}</p>
          <TextBtn
            text={linkText}
            size={3}
            callback={() => navigate(linkHref)}
          />
        </div>
      </section>
    </>
  );
}
