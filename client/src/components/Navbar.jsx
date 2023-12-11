import { useState } from 'react';
import menuImg from '../assets/menu.svg';
import MobileMenu from './MobileMenu';
import './Navbar.css';

const links = [
  { text: 'About', href: '#' },
  { text: 'Recipes', href: '#' },
  { text: 'Meal List', href: '#' },
  { text: 'Shopping List', href: '#' },
  { text: 'Profile', href: '#' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.classList.remove('noscroll');
    } else {
      setIsMenuOpen(true);
      document.body.classList.add('noscroll');
    }
  };

  return (
    <>
      <MobileMenu {...{ links, isMenuOpen, toggleMenu }} />

      <nav id="Navbar">
        <div id="Navbar--inner" className="inner">
          <button id="Navbar--menu-btn" onClick={toggleMenu}>
            <img src={menuImg} />
          </button>

          {links.map((link, i) => {
            return (
              <a key={i} href={link.href}>
                {link.text}
              </a>
            );
          })}

          <button id="Navbar--register-btn" className="Navbar--btn">
            Register
          </button>
          <button id="Navbar--sign-in-btn" className="Navbar--btn">
            Sign in
          </button>
        </div>
      </nav>
    </>
  );
}
