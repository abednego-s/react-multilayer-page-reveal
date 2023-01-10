export const debounce = (fn: Function, ms: number) => {
  let timer: number | null;
  return () => {
    if (timer !== null) clearTimeout(timer);
    timer = window.setTimeout(() => {
      timer = null;
      fn();
    }, ms);
  };
};
