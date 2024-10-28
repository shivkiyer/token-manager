/**
 * Truncate ETH address on mobile devices
 * @param {string} address ETH address
 * @returns {string} Truncated ETH address if on mobile device
 */
const formatEthAddress = (address: string) => {
  let account = address;
  if (window.innerWidth < 475) {
    account =
      address.substring(0, 7) +
      '...' +
      address.substring(address.length - 4, address.length);
  }
  return account;
};

export default formatEthAddress;
