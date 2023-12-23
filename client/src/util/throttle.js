export default function throttle(callback, delay) {
  let time = Date.now();

  return () => {
    if (time + delay - Date.now() <= 0) {
      callback();
      time = Date.now();
    }
  };
}
