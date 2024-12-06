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
 * @param {Object} user User model instance
 * @param {string} owner ETH address of account
 * @param {string} name Name of the wallet
 * @returns null
 * @throws {Error} If the username is not the owner of the ETH account
 * @throws {Error} If the wallet name is a duplicate for the owner
 */
const verifyWallet = async ({ user, owner, name }) => {
  const accountOwner = await getAccountByAddress(owner);

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
 * @param {Object} user User model instance
 * @param {string} name Wallet name
 * @param {string} description Wallet description/purpose
 * @param {string} address Blockchain address of wallet
 * @param {number} maxLimit Max withdrawal limit in Ether
 * @param {string} owner Blockchain address of owner
 * @returns {Object} New wallet
 */
const createWallet = async ({
  user,
  name,
  description,
  address,
  maxLimit,
  owner,
}) => {
  const accountOwner = await getAccountByAddress(owner);

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
 * @param {Object} user User model instance
 * @returns {Object} Array of wallets
 */
const retrieveWallets = async (user) => {
  try {
    const wallets = await getWalletsByUser({ user });
    const reducedWallets = wallets.map((item) => {
      const wallet = item.toJSON();
      if (
        wallet['owner'] !== null &&
        wallet['owner'] !== undefined &&
        wallet['owner']['userId'] === wallet['owner']['User']['id']
      ) {
        wallet['isOwner'] = true;
        delete wallet['owner']['User'];
      }

      if (wallet['user'] !== null && wallet['user'] !== undefined) {
        wallet['isOwner'] = false;
        delete wallet['user']['User'];
      }

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
 * @param {Object} user User model instance
 * @returns {Object} Wallet model instance
 * @throws {Error} If wallet could not be found
 * @throws {Error} If user is not owner of wallet
 */
const retrieveWalletDetails = async (id, user) => {
  try {
    const result = await Wallet.findOne({
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
          attributes: ['id', 'name', 'address', 'userId'],
          as: 'owner',
          required: true,
          include: [
            {
              model: User,
              attributes: ['id', 'username'],
            },
          ],
        },
        {
          model: Account,
          attributes: ['id', 'name', 'address', 'userId'],
          as: 'user',
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

    let wallet = result.toJSON();
    if (wallet['owner']['userId'] === user.id) {
      wallet['isOwner'] = true;
    } else {
      wallet['isOwner'] = false;
    }
    delete wallet['owner']['User'];
    return wallet;
  } catch (e) {
    throw 'Wallet could not be found';
  }
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
 * @param {string} walletAddress (optional) Address of wallet in case of managing users
 * @returns {Array} List of accounts
 */
const searchUsers = async ({ searchString, walletAddress }) => {
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
    const result = [...result1];
    const accountSearchIds = result1.map((item) => item.id);

    result2.forEach((item) => {
      if (!accountSearchIds.includes(item.id)) {
        result.push(item);
      }
    });

    if (walletAddress !== undefined && walletAddress !== null) {
      const wallet = await Wallet.findOne({
        where: {
          address: walletAddress,
        },
        attributes: [],
        include: [
          {
            model: Account,
            as: 'user',
            attributes: ['id'],
            through: { attributes: [] },
          },
        ],
      });
      const existingAccountIds = wallet.user.map((item) => {
        return item.id;
      });

      for (let i = result.length - 1; i > -1; i--) {
        const itemIndex = existingAccountIds.indexOf(result[i].id);
        if (itemIndex > -1) {
          result.splice(i, 1);
        }
      }
    }
    return result;
  } catch (e) {
    throw 'Accounts could not be fetched';
  }
};

/**
 * Adds an account as a wallet user
 * @param {Object} user User model instance
 * @param {string[]} accountAddresses Array of account ETH addresses
 * @param {string} walletAddress Wallet ETH address
 * @returns {Object} Wallet address
 * @throws {Error} If accounts or wallet cannot be found
 * @throws {Error} If logged-in user is not the owner of the wallet
 */
const addUser = async (user, accountAddresses, walletAddress) => {
  const accounts = await getAccountsByAddresses(accountAddresses);
  const wallet = await getWalletByAddress(walletAddress);

  const userWalletOwnerCheck = await isUserWalletOwner(user, wallet);
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
 * Removes accounts as users from a wallet
 * @param {Object} user User model instance
 * @param {string[]} accountAddresses Array of account ETH addresses
 * @param {string} walletAddress Wallet ETH address
 * @returns {Object} Wallet address
 * @throws {Error} If accounts or wallet cannot be found
 * @throws {Error} If logged-in user is not the owner of the wallet
 */
const removeUser = async ({ user, accountAddresses, walletAddress }) => {
  const accounts = await getAccountsByAddresses(accountAddresses);
  const wallet = await getWalletByAddress(walletAddress);

  const userWalletOwnerCheck = await isUserWalletOwner(user, wallet);
  if (!userWalletOwnerCheck) {
    throw 'Only wallet owner can remove users';
  }

  const checkAccountsInWallet = await areAccountUsersInWallet(accounts, wallet);
  if (!checkAccountsInWallet) {
    throw 'None of the accounts are users of the wallet';
  }

  try {
    await wallet.removeUser(accounts);
  } catch (e) {
    throw 'Account could not be removed wallet';
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

/**
 *
 * @param {Object} user User model instance
 * @param {string} address Wallet address
 * @param {string} name New wallet name
 * @param {string} description New wallet description
 * @param {number} maxLimit New wallet max withdrawal limit
 * @returns {Object} Updated wallet
 */
const updateWallet = async ({ user, address, name, description, maxLimit }) => {
  const wallet = await getWalletByAddress(address);
  const checkUserWalletOwner = await isUserWalletOwner(user, wallet);
  if (!checkUserWalletOwner) {
    throw 'Only wallet owner can change wallet details';
  }

  const walletsByUser = await getWalletsByUser({ name, user });
  const checkWalletName = walletsByUser.find(
    (item) => item.address !== address
  );

  if (checkWalletName !== null && checkWalletName !== undefined) {
    throw 'Another wallet with this name exists';
  }

  if (maxLimit !== null && maxLimit !== undefined) {
    if (isNaN(maxLimit) || maxLimit <= 0) {
      throw 'Max withdrawal limit must be a positive number';
    }
    wallet.maxLimit = Number(maxLimit);
  }

  if (name !== null && name !== undefined) {
    wallet.name = name;
  }

  if (description !== null && description !== undefined) {
    wallet.description = description;
  }

  await wallet.save();

  return wallet;
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
