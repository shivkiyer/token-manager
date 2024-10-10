const User = require('./../../db/models/user');
const Account = require('./../../db/models/account');

const getUserFromEmail = require('./../../utils/auth/getUserFromEmail');

/**
 * Fetches Ethereum accounts associated with a user
 * @param {string} username User email
 * @returns {Object} Array of accounts
 * @throws {Error} If the user could not be found
 */
const getAccounts = async (username) => {
  let user = await getUserFromEmail(username);
  try {
    const accounts = await user.getAccounts();
    const accountsInfo = accounts.map((accItem) => {
      return {
        accountName: accItem.name,
        accountAddress: accItem.address,
      };
    });
    return accountsInfo;
  } catch (e) {
    throw e;
  }
};

/**
 * Creates new Ethereum account associated with a user
 * @param {string} username Username
 * @param {string} accountName Name of the Ethereum account
 * @param {string} accountAddress Account address
 * @returns {Object} Name and address of the new account
 * @throws {Error} If the user could not be found
 * @throws {Error} If the account address already exists in database
 */
const addAccount = async ({ username, accountName, accountAddress }) => {
  let user = await getUserFromEmail(username);
  try {
    const checkAccountAddress = await Account.findAll({
      where: { address: accountAddress },
    });
    if (checkAccountAddress.length > 0) {
      throw 'Account is already associated with a user';
    }
    const account = await user.createAccount({
      name: accountName,
      address: accountAddress,
    });
    return { name: account.name, address: account.address };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getAccounts,
  addAccount,
};
