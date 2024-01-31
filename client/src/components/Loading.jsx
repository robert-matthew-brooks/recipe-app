import loadingImg from '../assets/loading.svg';
import './Loading.css';

export default function Loading({ isLoading, children }) {
  return (
    <div className="Loading">
      <div>{children}</div>
      <div className={`Loading__overlay ${!isLoading && 'hidden'}`}></div>
      <img
        className={`LoadingImg ${!isLoading && 'hidden'}`}
        src={loadingImg}
      />
    </div>
  );
}
