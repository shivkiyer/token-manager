const contractFactoryService = require('./../../services/contractFactory/contractFactoryService');

/**
 * Returns the deployed contract factory address
 * @param {Object} req Request
 * @param {Object} res Response
 * @throws {400} If contract address cannot be fetched
 */
const getAddress = async (req, res) => {
  try {
    const address = await contractFactoryService.getAddress();
    res.send({ data: address });
  } catch (e) {
    res.status(400).send({ message: e });
  }
};

module.exports = {
  getAddress,
};
