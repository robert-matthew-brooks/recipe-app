import { useState } from 'react';
import loadingImg from '../assets/loading.svg';
import './TextBtn.css';

export default function TextBtn({
  dataTest,
  light,
  style = 'dark', // light, danger, inverted
  text,
  size = 1,
  callback,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCallback = async () => {
    setIsLoading(true);
    await callback();
    setIsLoading(false);
  };

  return (
    <button
      data-test={dataTest}
      className={`TextBtn TextBtn--${style}`}
      style={{
        height: `${size}rem`,
        fontSize: `${size / 2.5}rem`,
        padding: `0 ${size / 1.8}rem`,
      }}
      onClick={handleCallback}
      disabled={isLoading}
    >
      <span style={{ visibility: isLoading && 'hidden' }}>{text}</span>
      {isLoading && <img src={loadingImg} />}
    </button>
  );
}
