const walletService = require('./../../services/wallets/walletService');
const requestDataValidator = require('./../../utils/http/requestDataValidator');

/**
 * Controller for checking wallet info before creating
 * @param {Object} req Request
 * @param {Object} res Response
 * @returns
 * @throws {400} If wallet name is duplicate or user is not owner of wallet
 */
const verifyWallet = async (req, res) => {
  const { username } = req;
  const { name, owner } = req.body;

  const requestBodyCheck = requestDataValidator(req, ['name', 'owner']);
  if (requestBodyCheck !== null) {
    return res.status(400).send({ message: requestBodyCheck });
  }

  try {
    const result = await walletService.verifyWallet({ username, owner, name });
    return res.send();
  } catch (e) {
    return res.status(400).send({ message: e });
  }
};

/**
 * Controller to creatina new wallet
 * @param {Object} req Request
 * @param {Object} res Response
 * @returns New wallet
 * @throws {400} If wallet could not be created if owner not found or same name exists
 */
const createWallet = async (req, res) => {
  const { username } = req;
  const { name, description, address, maxLimit, owner } = req.body;

  const requestBodyCheck = requestDataValidator(req, [
    'name',
    'address',
    'maxLimit',
    'owner',
  ]);
  if (requestBodyCheck !== null) {
    return res.status(400).send({ message: requestBodyCheck });
  }

  try {
    const result = await walletService.createWallet({
      username,
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
 * Controller for retrieving wallets by user
 * @param {Object} req Request
 * @param {Object} res Response
 * @returns {Object} Array of wallets
 */
const retrieveWallets = async (req, res) => {
  const { username } = req;

  try {
    const wallets = await walletService.retrieveWallets(username);
    res.send({ data: wallets });
  } catch (e) {
    res.status(400).send({ message: e });
  }
};

/**
 * Controller for retrieving the details of a wallet
 * @param {Object} req Request
 * @param {Object} res Response
 * @returns {Object} Wallet model instance
 */
const retrieveWalletDetails = async (req, res) => {
  const { username } = req;
  const { id } = req.params;

  if (id === null || id === undefined) {
    return res.status(400).send({ message: 'Wallet Id not provided' });
  }

  try {
    const wallet = await walletService.retrieveWalletDetails(id, username);
    res.send({ data: wallet });
  } catch (e) {
    res.status(400).send({ message: e });
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
  verifyWallet,
  createWallet,
  retrieveWallets,
  retrieveWalletDetails,
  addUser,
};
