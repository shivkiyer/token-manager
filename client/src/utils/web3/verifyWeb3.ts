/**
 * Verifies if web3 instance exists and accounts are connected
 * @param {Object} web3 web3 instance
 * @returns {string|null} Error message
 */
const verifyWeb3 = async (web3: any): Promise<string | null> => {
  if (web3 === null) {
    return 'Please connect to Metamask to add an account';
  }
  const accounts = await web3.eth.getAccounts();
  if (accounts.length === 0) {
    return 'Metamask is locked or not connected.';
  }

  return null;
};

export default verifyWeb3;
