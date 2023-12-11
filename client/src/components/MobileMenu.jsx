import closeImg from '../assets/close.svg';
import './MobileMenu.css';

export default function MobileMenu({ links, isMenuOpen, toggleMenu }) {
  return (
    <>
      <div
        id="MobileMenu--overlay"
        className={!isMenuOpen ? 'MobileMenu--overlay__hidden' : undefined}
      ></div>

      <nav
        id="MobileMenu"
        className={!isMenuOpen ? 'MobileMenu__hidden' : undefined}
      >
        <button id="MobileMenu--close-btn" onClick={toggleMenu}>
          <img src={closeImg} />
        </button>

        <ul id="MobileMenu--links">
          {links.map((link, i) => {
            return (
              <li key={i}>
                <a href={link.href}>{link.text}</a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
