import headerImg from '../assets/header2.jpg';
import './Header.css';

export default function Header({ title }) {
  return (
    <header id="Header" style={{ backgroundImage: `url('${headerImg}')` }}>
      <div id="Header--inner" className="inner">
        <h1 id="Header--title">{title}</h1>
      </div>
    </header>
  );
}
