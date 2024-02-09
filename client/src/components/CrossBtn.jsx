import closeImg from '../assets/close.svg';
import './CrossBtn.css';

export default function CrossBtn({
  style = 'dark',
  size = 1,
  hidden,
  callback,
}) {
  return (
    <button
      className={`CrossBtn CrossBtn--${style}`}
      style={{ width: `${size}rem`, display: hidden && 'none' }}
      onClick={callback}
    >
      <img src={closeImg} />
    </button>
  );
}
