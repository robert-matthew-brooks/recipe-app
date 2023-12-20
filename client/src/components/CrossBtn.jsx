import closeImg from '../assets/close.svg';
import './CrossBtn.css';

export default function CrossBtn({ light, size, hidden, cb }) {
  return (
    <button
      className={`CrossBtn CrossBtn--${light ? 'light' : 'dark'}`}
      style={{ width: size || '1rem', display: hidden && 'none' }}
      onClick={cb}
    >
      <img src={closeImg} />
    </button>
  );
}
