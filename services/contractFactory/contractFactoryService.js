const path = require('path');
const fs = require('fs');

/**
 * Fetches the address of the deployed contract factory
 * @returns {string} Contract address
 * @throws {Error} If address cannot be fetched
 */
const getAddress = async () => {
  try {
    const rootPath = path.dirname(path.dirname(__dirname));
    let chainId;
    if (process.env.NODE_ENV === 'development') {
      chainId = process.env.DEV_BLOCKCHAIN_ID;
    }
    const filePath = path.resolve(
      rootPath,
      process.env.BLOCKCHAIN_BASE_DIR,
      'broadcast',
      process.env.CONTRACT_FACTORY_NAME,
      chainId,
      'run-latest.json'
    );
    const broadcastFile = await fs.promises.readFile(filePath, {
      encoding: 'utf8',
      flag: 'r',
    });
    const broadcastObj = JSON.parse(broadcastFile);
    const contract = broadcastObj.transactions.filter(
      (transaction) =>
        transaction.transactionType.trim().toLowerCase() === 'create' &&
        transaction.contractName === 'TokenManagerFactory'
    );
    if (contract.length === 0 || contract.length > 1) {
      throw 'Error';
    }
    const contractAddress = contract[0].contractAddress;
    return contractAddress;
  } catch (e) {
    throw 'Contract Factory address could not be fetched';
  }
};

module.exports = {
  getAddress,
};
