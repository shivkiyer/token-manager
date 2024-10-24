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

/**
 * Controller for adding an account as a wallet user/withdrawer
 * @param {Object} req Request
 * @param {Object} res Response
 * @throws {400} If account or wallet cannot be found
 * @throws {400} If logged in user is not owner of wallet
 * @throws {400} If account has already been added as a wallet user
 */
const addUser = async (req, res) => {
  const { username } = req;
  const { accounts } = req.body;
  const { address: walletAddress } = req.params;

  try {
    const result = await walletService.addUser(
      username,
      accounts,
      walletAddress
    );
    res.send({ data: result });
  } catch (e) {
    res.status(400).send({ message: e });
  }
};

module.exports = {
  createWallet,
  addUser,
};
