import menuImg from '../assets/menu.svg';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav id="Navbar">
      <div id="Navbar--inner" className="inner">
        <button id="Navbar--menu-btn">
          <img src={menuImg} />
        </button>
        <a href="#">Recipes</a>
        <a href="#">Meal List</a>
        <a href="#">Shopping List</a>
        <a href="#">Profile</a>
        <button id="Navbar--register-btn" className="Navbar--btn">
          Register
        </button>
        <button id="Navbar--sign-in-btn" className="Navbar--btn">
          Sign in
        </button>
      </div>
    </nav>
  );
}
