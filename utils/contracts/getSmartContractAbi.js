const path = require('path');
const fs = require('fs');

/**
 * Returns the ABI of a compiled smart contract
 * @param {string} contractName Name of the smart contract
 * @returns {Object} Contract ABI
 */
const getSmartContractAbi = async (contractName) => {
  const rootPath = path.dirname(path.dirname(__dirname));
  const abiPath = path.resolve(
    rootPath,
    'hardhat',
    'artifacts',
    'contracts',
    `${contractName}.sol`,
    `${contractName}.json`
  );

  const abiString = await fs.promises.readFile(abiPath, {
    encoding: 'utf-8',
    flag: 'r',
  });
  const abi = JSON.parse(abiString).abi;
  return abi;
};

module.exports = getSmartContractAbi;
