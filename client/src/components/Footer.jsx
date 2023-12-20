import linkedinImg from '../assets/sm-icons/linkedin.svg';
import githubImg from '../assets/sm-icons/github.svg';
import youtubeImg from '../assets/sm-icons/youtube.svg';
import './Footer.css';

const smLinks = [
  {
    src: linkedinImg,
    href: '#',
  },
  {
    src: githubImg,
    href: '#',
  },
  {
    src: youtubeImg,
    href: '#',
  },
];

export default function Footer() {
  return (
    <footer id="Footer">
      <div id="Footer__inner" className="inner">
        <ul className="Footer__list">
          <li>Robert Matthew Brooks</li>
          <li>&copy; 2023</li>
        </ul>
        <ul className="Footer__sm-links">
          {smLinks.map((link, i) => {
            return (
              <li key={i}>
                <a href={link.href}>
                  <img src={link.src} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
