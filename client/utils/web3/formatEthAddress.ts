/**
 * Truncate ETH address on mobile devices
 * @param {string} address ETH address
 * @param {boolean} always (optional) If ETH address should always be trunctated
 * @returns {string} Truncated ETH address if on mobile device or if always is true
 */
const formatEthAddress = (address: string | null, always = false) => {
  if (!address) return null;
  return (
    address.substring(0, 7) +
    '...' +
    address.substring(address.length - 4, address.length)
  );
};

export default formatEthAddress;
