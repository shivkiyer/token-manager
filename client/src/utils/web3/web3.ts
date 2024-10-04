import Web3 from 'web3';

/**
 * Requests access to Ethereum (Metamask) account
 *
 * @returns {Object} Web3 instance
 */
async function getWeb3() {
  await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
  const web3 = new Web3((window as any).ethereum);
  return web3;
}

export default getWeb3;
