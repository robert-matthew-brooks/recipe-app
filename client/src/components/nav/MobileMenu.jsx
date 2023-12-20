import { Link } from 'react-router-dom';
import closeImg from '../../assets/close.svg';
import './MobileMenu.css';

export default function MobileMenu({ links, isMenuOpen, toggleMenu }) {
  return (
    <>
      <div
        id="MobileMenu__overlay"
        className={!isMenuOpen ? 'MobileMenu__overlay--hidden' : undefined}
      ></div>

      <nav
        id="MobileMenu"
        className={!isMenuOpen ? 'MobileMenu--hidden' : undefined}
      >
        <button id="MobileMenu__close-btn" onClick={toggleMenu}>
          <img src={closeImg} />
        </button>

        <ul id="MobileMenu__links">
          {links.map((link, i) => {
            return (
              <li key={i}>
                <Link to={link.href} onClick={toggleMenu}>
                  {link.text}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
