const sequelize = require('sequelize');
const { Op } = require('sequelize');
const Account = require('./../../db/models/account');
const Wallet = require('./../../db/models/wallet');
const User = require('./../../db/models/user');
const getAccountByAddress = require('./../../utils/accounts/getAccountByAddress');
const getAccountsByAddresses = require('./../../utils/accounts/getAccountsByAddresses');
const isUserWalletOwner = require('./../../utils/wallets/isUserWalletOwner');
const getWalletByAddress = require('./../../utils/wallets/getWalletByAddress');
const areAccountUsersInWallet = require('./../../utils/wallets/areAccountUsersInWallet');
const getUserFromEmail = require('./../../utils/auth/getUserFromEmail');
const getWalletsByUser = require('./../../utils/wallets/getWalletsByUser');
const getSmartContractAbi = require('./../../utils/contracts/getSmartContractAbi');

/**
 * Checks if user is owner of account creating the wallet
 * and that a wallet of the same name does not exist
 * @param {string} username User email
 * @param {string} owner ETH address of account
 * @param {string} name Name of the wallet
 * @returns null
 * @throws {Error} If the username is not the owner of the ETH account
 * @throws {Error} If the wallet name is a duplicate for the owner
 */
const verifyWallet = async ({ username, owner, name }) => {
  const accountOwner = await getAccountByAddress(owner);
  const user = await getUserFromEmail(username);

  if (accountOwner.userId !== user.id) {
    throw 'Only the account owner can use the account to create a wallet';
  }

  let checkWallet;
  try {
    checkWallet = await getWalletsByUser({ name, user });
  } catch (e) {
    throw 'Could not fetch wallets of the user';
  }

  if (checkWallet.length > 0) {
    throw 'Wallet with the same name exists';
  }
};

/**
 * Creates a new wallet with an ETH account as owner
 * @param {string} username Email of user owning the account
 * @param {string} name Wallet name
 * @param {string} description Wallet description/purpose
 * @param {string} address Blockchain address of wallet
 * @param {number} maxLimit Max withdrawal limit in Ether
 * @param {string} owner Blockchain address of owner
 * @returns {Object} New wallet
 */
const createWallet = async ({
  username,
  name,
  description,
  address,
  maxLimit,
  owner,
}) => {
  const accountOwner = await getAccountByAddress(owner);
  const user = await getUserFromEmail(username);

  if (accountOwner.userId !== user.id) {
    throw 'Only the account owner can use the account to create a wallet';
  }

  let checkWallet;
  try {
    checkWallet = await getWalletsByUser({ name, user });
  } catch (e) {
    throw 'Could not create wallet';
  }

  if (checkWallet.length > 0) {
    throw 'Wallet with the same name exists';
  }

  try {
    const newWallet = await Wallet.create({
      name,
      description,
      address,
      maxLimit,
    });
    await accountOwner.addWallet(newWallet);
    return { name, description, maxLimit };
  } catch (e) {
    throw 'Count not create wallet';
  }
};

/**
 * Returns wallets by user association
 * @param {string} username User email
 * @returns {Object} Array of wallets
 */
const retrieveWallets = async (username) => {
  const user = await getUserFromEmail(username);

  try {
    const wallets = await getWalletsByUser({ user });
    const reducedWallets = wallets.map((item) => {
      const wallet = item.toJSON();
      if (wallet['owner']['userId'] === wallet['owner']['User']['id']) {
        wallet['isOwner'] = true;
      }
      delete wallet['owner']['User'];
      return wallet;
    });
    return reducedWallets;
  } catch (e) {
    throw 'Could not fetch wallets';
  }
};

/**
 * Retrieves the details of a wallet
 * @param {number} id Wallet Id in database
 * @param {string} username Requesting user
 * @returns {Object} Wallet model instance
 * @throws {Error} If wallet could not be found
 * @throws {Error} If user is not owner of wallet
 */
const retrieveWalletDetails = async (id, username) => {
  let wallet;
  try {
    wallet = await Wallet.findOne({
      where: { id },
      attributes: [
        'id',
        'name',
        'description',
        'maxLimit',
        'ownerId',
        'address',
      ],
      include: [
        {
          model: Account,
          attributes: ['id', 'name', 'address'],
          as: 'owner',
          required: true,
        },
      ],
    });
  } catch (e) {
    throw 'Wallet could not be found';
  }

  const checkWalletOwner = await isUserWalletOwner(username, wallet);
  if (!checkWalletOwner) {
    throw 'Only wallet owner can view wallet details';
  }

  return wallet;
};

/**
 * Returns the accounts added to a wallet as Users
 * @param {string} walletAddress ETH address of the wallet
 * @returns {Array} List of wallet users
 */
const getUsers = async (walletAddress) => {
  try {
    const query = await Wallet.findOne({
      where: { address: walletAddress },
      include: [
        {
          model: Account,
          as: 'user',
          attributes: ['id', 'name', 'address'],
          through: { attributes: [] },
          include: [
            {
              model: User,
              attributes: ['id', 'username'],
            },
          ],
        },
      ],
    });
    const walletUsers = query.user;
    return walletUsers;
  } catch (e) {
    throw 'Wallet users could not be fetched';
  }
};

/**
 * Searching for accounts based on account and user fields
 * @param {string} searchString Search query string
 * @returns {Array} List of accounts
 */
const searchUsers = async (searchString) => {
  try {
    const result1 = await Account.findAll({
      where: {
        [Op.or]: {
          name: { [Op.iLike]: '%' + searchString + '%' },
          address: { [Op.iLike]: '%' + searchString + '%' },
        },
      },
      attributes: ['id', 'name', 'address'],
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
      ],
    });

    const result2 = await Account.findAll({
      attributes: ['id', 'name', 'address'],
      include: [
        {
          model: User,
          where: {
            [Op.or]: {
              username: { [Op.iLike]: '%' + searchString + '%' },
              name: { [Op.iLike]: '%' + searchString + '%' },
              designation: { [Op.iLike]: '%' + searchString + '%' },
            },
          },
          attributes: ['id', 'username'],
        },
      ],
    });
    const result = [...result1, ...result2];
    return result;
  } catch (e) {
    throw 'Accounts could not be fetched';
  }
};

/**
 * Adds an account as a wallet user
 * @param {string} username User email
 * @param {string[]} accountAddresses Array of account ETH addresses
 * @param {string} walletAddress Wallet ETH address
 * @returns {Object} Wallet address
 * @throws {Error} If accounts or wallet cannot be found
 * @throws {Error} If logged-in user is not the owner of the wallet
 */
const addUser = async (username, accountAddresses, walletAddress) => {
  const accounts = await getAccountsByAddresses(accountAddresses);
  const wallet = await getWalletByAddress(walletAddress);

  const userWalletOwnerCheck = await isUserWalletOwner(username, wallet);
  if (!userWalletOwnerCheck) {
    throw 'Only wallet owner can add users';
  }

  const checkAccountsInWallet = await areAccountUsersInWallet(accounts, wallet);
  if (checkAccountsInWallet) {
    throw 'One or more accounts already added to wallet';
  }

  try {
    await wallet.addUser(accounts);
  } catch (e) {
    throw 'Account could not be added to wallet';
  }

  return {
    walletAddress: wallet.address,
  };
};

/**
 * Returns the ABI of the Shared Wallet
 * @returns {Object} Shared Wallet Contract ABI
 */
const getAbi = async () => {
  try {
    const abi = await getSmartContractAbi(
      process.env.SHARED_WALLET_CONTRACT_NAME
    );
    return abi;
  } catch (e) {
    throw 'Wallet JSON interface could not be fetched';
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
  getAbi,
};
