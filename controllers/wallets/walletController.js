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
  const { user } = req;
  const { name, owner } = req.body;

  const requestBodyCheck = requestDataValidator(req, ['name', 'owner']);
  if (requestBodyCheck !== null) {
    return res.status(400).send({ message: requestBodyCheck });
  }

  try {
    const result = await walletService.verifyWallet({ user, owner, name });
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
  const { user } = req;
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
      user,
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
  const { user } = req;

  try {
    const wallets = await walletService.retrieveWallets(user);
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
  const { user } = req;
  const { id } = req.params;

  if (id === null || id === undefined) {
    return res.status(400).send({ message: 'Wallet Id not provided' });
  }

  try {
    const wallet = await walletService.retrieveWalletDetails(id, user);
    res.send({ data: wallet });
  } catch (e) {
    res.status(400).send({ message: e });
  }
};

/**
 * Controller for getting WalletUsers of a Wallet
 * @param {Object} req Request
 * @param {Object} res Response
 * @throws {400} If wallet cannot be found
 */
const getUsers = async (req, res) => {
  const { address: walletAddress } = req.params;

  try {
    const response = await walletService.getUsers(walletAddress);
    res.send({ data: response });
  } catch (e) {
    res.status(400).send({ message: e });
  }
};

/**
 * Controller for searching users (accounts)
 * @param {Object} req Request
 * @param {Object} res Response
 */
const searchUsers = async (req, res) => {
  let searchString = req.query.search;
  let walletAddress = req.query.wallet;

  if (
    searchString === null ||
    searchString === undefined ||
    searchString.trim().length === 0
  ) {
    return res.status(400).send({ message: 'Empty search string' });
  }

  try {
    const response = await walletService.searchUsers({
      searchString,
      walletAddress,
    });
    res.send({ data: response });
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
  const { user } = req;
  const { accounts } = req.body;
  const { address: walletAddress } = req.params;

  try {
    const result = await walletService.addUser(
      user,
      accounts,
      walletAddress
    );
    res.send({ data: result });
  } catch (e) {
    res.status(400).send({ message: e });
  }
};

/**
 *
 * Controller for removing accounts as a wallet user/withdrawer
 * @param {Object} req Request
 * @param {Object} res Response
 * @throws {400} If account or wallet cannot be found
 * @throws {400} If logged in user is not owner of wallet
 * @throws {400} If accounts are not wallet users
 */
const removeUser = async (req, res) => {
  const { user } = req;
  const { accounts: accountAddresses } = req.body;
  const { address: walletAddress } = req.params;

  if (
    accountAddresses === null ||
    accountAddresses === undefined ||
    accountAddresses.length === 0
  ) {
    return res.status(400).send({ message: 'Account addresses missing' });
  }

  try {
    const result = await walletService.removeUser({
      user,
      accountAddresses,
      walletAddress,
    });
    res.send({ data: result });
  } catch (e) {
    res.status(400).send({ message: e });
  }
};

/**
 * Fetch the ABI of the deployed Shared Wallet smart contract
 * @param {Object} req Request
 * @param {Object} res Response
 */
const getAbi = async (req, res) => {
  try {
    const abi = await walletService.getAbi();
    res.send({ data: abi });
  } catch (e) {
    res.status(400).send({ message: e });
  }
};

/**
 *
 * Controller for updating a wallet
 * @param {Object} req Request
 * @param {Object} res Response
 * @throws {400} If the new wallet name is a duplicate
 * @throws {400} If the new max limit is not a positive number
 * @throws {400} If requesting user is not the wallet owner
 */
const updateWallet = async (req, res) => {
  const { user } = req;
  const { name, description, maxLimit } = req.body;
  const { address } = req.params;

  if (
    (name === null || name === undefined) &&
    (description === null || description === undefined) &&
    (maxLimit === null || maxLimit === undefined)
  ) {
    return res.status(400).send({ message: 'Empty request' });
  }

  try {
    const response = await walletService.updateWallet({
      user,
      address,
      name,
      description,
      maxLimit,
    });
    res.send({ data: response });
  } catch (e) {
    res.status(400).send({ message: e });
  }
};

module.exports = {
  verifyWallet,
  createWallet,
  retrieveWallets,
  retrieveWalletDetails,
  getUsers,
  searchUsers,
  addUser,
  removeUser,
  getAbi,
  updateWallet,
};
