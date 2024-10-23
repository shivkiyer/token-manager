const Account = require('./../../db/models/account');
const Wallet = require('./../../db/models/wallet');
const isUserWalletOwner = require('../../utils/wallets/isUserWalletOwner');

/**
 * Creates a new wallet with an ETH account as owner
 * @param {string} name Wallet name
 * @param {string} description Wallet description/purpose
 * @param {string} address Blockchain address of wallet
 * @param {number} maxLimit Max withdrawal limit in Ether
 * @param {string} owner Blockchain address of owner
 * @returns {Object} New wallet
 */
const createWallet = async ({
  name,
  description,
  address,
  maxLimit,
  owner,
}) => {
  let accountOwner;
  try {
    accountOwner = await Account.findOne({ where: { address: owner } });
  } catch (e) {
    throw 'Owner not found';
  }

  const checkWallet = await Wallet.findAll({
    where: { name, ownerId: accountOwner.userId },
  });
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
 * Adds an account as a wallet user
 * @param {string} username User email
 * @param {string} accountAddress Account ETH address
 * @param {string} walletAddress Wallet ETH address
 * @returns {Object} Account and wallet address
 * @throws {Error} If account or wallet cannot be found
 * @throws {Error} If logged-in user is not the owner of the wallet
 * @throws {Error} If account is already a wallet user
 */
const addUser = async (username, accountAddress, walletAddress) => {
  let account;
  let wallet;
  try {
    account = await Account.findOne({ where: { address: accountAddress } });
  } catch (e) {
    throw 'User ETH account could not be found';
  }

  try {
    wallet = await Wallet.findOne({ where: { address: walletAddress } });
  } catch (e) {
    throw 'Wallet could not be found';
  }

  const userWalletOwnerCheck = await isUserWalletOwner(username, wallet);
  if (!userWalletOwnerCheck) {
    throw 'Only wallet owner can add users';
  }

  const checkAccountInWallet = await wallet.hasUser(account);
  if (checkAccountInWallet) {
    throw 'Account already added to wallet';
  }

  try {
    await wallet.addUser(account);
  } catch (e) {
    throw 'Account could not be added to wallet';
  }

  return {
    accountAddress: account.address,
    walletAddress: wallet.address,
  };
};

module.exports = {
  createWallet,
  addUser,
};
