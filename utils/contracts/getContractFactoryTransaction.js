const path = require('path');
const fs = require('fs');

/**
 * Reads the JSON file from the Foundry broadcast directory
 * where contracts/scripts are recorded.
 * @returns {Object} JS object with contract transaction details
 */
const getContractFactoryTransaction = async () => {
  const rootPath = path.dirname(path.dirname(__dirname));
  let chainId;
  if (process.env.NODE_ENV === 'development') {
    chainId = process.env.DEV_BLOCKCHAIN_ID;
  }
  const filePath = path.resolve(
    rootPath,
    process.env.BLOCKCHAIN_BASE_DIR,
    'ignition',
    'deployments',
    `chain-${chainId}`,
    'deployed_addresses.json'
  );
  const broadcastFile = await fs.promises.readFile(filePath, {
    encoding: 'utf8',
    flag: 'r',
  });
  const broadcastObj = JSON.parse(broadcastFile);
  return broadcastObj;
};

module.exports = getContractFactoryTransaction;
