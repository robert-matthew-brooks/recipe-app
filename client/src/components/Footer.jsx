import './Footer.css';

export default function Footer() {
  return (
    <footer id="Footer">
      <div id="Footer--inner" className="inner">
        <ul className="Footer--list">
          <li>Robert Matthew Brooks</li>
          <li>&copy; 2023</li>
        </ul>
        <ul className="Footer--list">
          <li>
            <a href="#">LinkedIn</a>
          </li>
          <li>
            <a href="#">GitHub</a>
          </li>
          <li>
            <a href="#">YouTube</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
