const Account = require('./../../db/models/account');

/**
 * Fetches an Account instance by the ETH address
 * @param {string} address ETH address of account
 * @returns {Object} Account model instance
 * @throws {Error} If account is not found
 */
const getAccountByAddress = async (address) => {
  try {
    const account = await Account.findOne({ where: { address } });
    return account;
  } catch (e) {
    throw 'Account not found';
  }
};

module.exports = getAccountByAddress;
