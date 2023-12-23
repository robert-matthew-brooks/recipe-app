import { useEffect, useState } from 'react';
import throttle from '../../util/throttle';
import arrowUpImg from '../../assets/arrow-up.svg';
import './ScrollTopBtn.css';

export default function ScrollTopBtn() {
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = throttle(() => {
    const scrollY = window.scrollY;

    if (!isVisible && scrollY > window.innerHeight && scrollY < prevScrollY) {
      setIsVisible(true);
    } else if (isVisible && scrollY < 100) {
      setIsVisible(false);
    }

    setPrevScrollY(scrollY);
  }, 100);

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible, prevScrollY]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.addEventListener(
      'scrollend',
      () => {
        setPrevScrollY(0);
        setIsVisible(false);
      },
      { once: true }
    );
  };

  return (
    <div
      id="ScrollTopBtn"
      data-test="scroll-top-btn"
      className={!isVisible ? 'ScrollTopBtn--hidden' : ''}
    >
      <img src={arrowUpImg} onClick={scrollTop} />
    </div>
  );
}
