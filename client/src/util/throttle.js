export default function throttle(cb, delay) {
  let time = Date.now();

  return () => {
    if (time + delay - Date.now() <= 0) {
      cb();
      time = Date.now();
    }
  };
}
