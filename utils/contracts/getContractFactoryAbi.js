const path = require('path');
const fs = require('fs');

/**
 * Returns the ABI of the compiled contract factory
 * @returns {Object} Contract ABI
 */
const getContractFactoryAbi = async () => {
  const rootPath = path.dirname(path.dirname(__dirname));
  const abiPath = path.resolve(
    rootPath,
    'blockchain',
    'out',
    `${process.env.CONTRACT_FACTORY_NAME}.sol`,
    `${process.env.CONTRACT_FACTORY_NAME}.json`
  );

  const abiString = await fs.promises.readFile(abiPath, {
    encoding: 'utf-8',
    flag: 'r',
  });
  const abi = JSON.parse(abiString).abi;
  return abi;
};

module.exports = getContractFactoryAbi;
