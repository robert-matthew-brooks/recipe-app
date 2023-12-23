import loadingImg from '../assets/loading.svg';
import './TextBtn.css';

export default function TextBtn({
  dataTest,
  light,
  text,
  size = 1,
  callback,
  isLoading,
}) {
  return (
    <button
      data-test={dataTest}
      className={`TextBtn TextBtn--${light ? 'light' : 'dark'}`}
      style={{
        height: `${size}rem`,
        fontSize: `${size / 2.5}rem`,
        padding: `0 ${size / 1.8}rem`,
      }}
      onClick={callback}
      disabled={isLoading}
    >
      <span style={{ visibility: isLoading && 'hidden' }}>{text}</span>
      {isLoading && <img src={loadingImg} />}
    </button>
  );
}
