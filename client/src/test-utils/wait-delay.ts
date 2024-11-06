/**
 * Add a delay - for DOM to refresh
 * @param {number} delay Delay in ms
 * @returns Promise that resolves in delay time
 */
const waitDelay = (delay: number) => {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(null);
    }, delay);
  });
};

export default waitDelay;
