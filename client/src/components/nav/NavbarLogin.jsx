import { Link } from 'react-router-dom';
import './Navbar.css';

export default function NavbarLogin() {
  return (
    <nav id="Navbar">
      <div id="Navbar--inner" className="inner">
        <Link to={'/'}>&larr; Back to site</Link>
      </div>
    </nav>
  );
}
