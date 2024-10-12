const getContractFactoryTransaction = require('./../../utils/contracts/getContractFactoryTransaction');

/**
 * Fetches the address of the deployed contract factory
 * @returns {string} Contract address
 * @throws {Error} If address cannot be fetched
 */
const getAddress = async () => {
  try {
    const contractJson = await getContractFactoryTransaction();
    const contract = contractJson.transactions.filter(
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
