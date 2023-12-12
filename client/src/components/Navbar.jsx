import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import menuImg from '../assets/menu.svg';
import MobileMenu from './MobileMenu';
import './Navbar.css';

const links = [
  { text: 'About', href: '/about' },
  { text: 'Recipes', href: '/' },
  { text: 'Meal List', href: '/meal-list' },
  { text: 'Shopping List', href: '/shopping-list' },
  { text: 'Profile', href: '/profile' },
];

export default function Navbar() {
  const navigate = useNavigate();
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

          <div id="Navbar--desktop-links">
            {links.map((link, i) => {
              return (
                <Link key={i} to={link.href}>
                  {link.text}
                </Link>
              );
            })}
          </div>

          <button
            id="Navbar--register-btn"
            className="Navbar--btn"
            onClick={() => {
              navigate('/register');
            }}
          >
            Register
          </button>
          <button
            id="Navbar--sign-in-btn"
            className="Navbar--btn"
            onClick={() => {
              navigate('/login');
            }}
          >
            Sign in
          </button>
        </div>
      </nav>
    </>
  );
}
