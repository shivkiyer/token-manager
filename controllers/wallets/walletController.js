const walletService = require('./../../services/wallets/walletService');

/**
 * Controller to creatina new wallet
 * @param {Object} req Request
 * @param {Object} res Response
 * @returns New wallet
 * @throws {400} If wallet could not be created if owner not found or same name exists
 */
const createWallet = async (req, res) => {
  const { name, description, address, maxLimit, owner } = req.body;

  try {
    const result = await walletService.createWallet({
      name,
      description,
      address,
      maxLimit,
      owner,
    });
    return res.status(201).send({ data: result });
  } catch (e) {
    return res.status(400).send({ message: e });
  }
};

module.exports = {
  createWallet,
};
