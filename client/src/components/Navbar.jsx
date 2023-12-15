import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const { activeUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginScreen, setIsLoginScreen] = useState(false);

  // show back button only on login/register screens
  useEffect(() => {
    if (['/login', '/register'].includes(location.pathname)) {
      setIsLoginScreen(true);
    } else {
      setIsLoginScreen(false);
    }
  }, [location]);

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.classList.remove('noscroll');
    } else {
      setIsMenuOpen(true);
      document.body.classList.add('noscroll');
    }
  };

  if (isLoginScreen) {
    return (
      <nav id="Navbar">
        <div id="Navbar--inner" className="inner">
          <Link to={'/'}>&larr; Back to site</Link>
        </div>
      </nav>
    );
  } else {
    return (
      <>
        <MobileMenu {...{ links, isMenuOpen, toggleMenu }} />

        <nav id="Navbar">
          <div id="Navbar--inner" className="inner">
            <button id="Navbar--menu-btn" onClick={toggleMenu}>
              <img src={menuImg} />
            </button>

            <div id="Navbar--links-wrapper">
              {links.map((link, i) => {
                return (
                  <Link key={i} to={link.href}>
                    {link.text}
                  </Link>
                );
              })}
            </div>

            <div id="Navbar--btn-wrapper">
              {!activeUser && (
                <button
                  id="Navbar--register-btn"
                  className="Navbar--btn"
                  onClick={() => {
                    navigate('/register');
                  }}
                >
                  Register
                </button>
              )}

              <button
                id="Navbar--auth-btn"
                className="Navbar--btn"
                onClick={() => {
                  activeUser ? navigate('/logout') : navigate('/login');
                }}
              >
                {activeUser ? 'Sign out' : 'Sign in'}
              </button>
            </div>
          </div>
        </nav>
      </>
    );
  }
}
