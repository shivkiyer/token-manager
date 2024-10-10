/**
 * Inserts a delay
 * @param {number} delay Delay in ms
 * @returns {Promise} Promise that resolves after the delay
 */
const waitDelay = (delay) => {
  const wait = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
  return wait;
};

module.exports = waitDelay;
