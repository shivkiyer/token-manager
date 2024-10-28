const User = require('./../../db/models/user');
const Account = require('./../../db/models/account');
const Wallet = require('./../../db/models/wallet');
const getAccountByAddress = require('./../../utils/accounts/getAccountByAddress');
const getAccountsByAddresses = require('./../../utils/accounts/getAccountsByAddresses');
const isUserWalletOwner = require('./../../utils/wallets/isUserWalletOwner');
const getWalletByAddress = require('./../../utils/wallets/getWalletByAddress');
const areAccountUsersInWallet = require('./../../utils/wallets/areAccountUsersInWallet');
const getUserFromEmail = require('./../../utils/auth/getUserFromEmail');


const verifyWallet = async ({username, owner, name}) => {
  const accountOwner = await getAccountByAddress(owner);
  const user = await getUserFromEmail(username);

  if (accountOwner.userId !== user.id) {
    throw 'Only the account owner can use the account to create a wallet';
  }

  let checkWallet;
  try {
    checkWallet = await Wallet.findAll({
      where: { name },
      include: [
        {
          model: Account,
          as: 'owner',
          required: true,
          include: [
            {
              model: User,
              required: true,
              where: { id: accountOwner.userId },
            },
          ],
        },
      ],
    });
  } catch (e) {
    throw 'Could not create wallet';
  }

  if (checkWallet.length > 0) {
    throw 'Wallet with the same name exists';
  }
}

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
    checkWallet = await Wallet.findAll({
      where: { name },
      include: [
        {
          model: Account,
          as: 'owner',
          required: true,
          include: [
            {
              model: User,
              required: true,
              where: { id: accountOwner.userId },
            },
          ],
        },
      ],
    });
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

module.exports = {
  verifyWallet,
  createWallet,
  addUser,
};
