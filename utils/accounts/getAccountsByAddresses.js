const { Op } = require('sequelize');

const Account = require('./../../db/models/account');

/**
 * Returns accounts from an array of ETH addresses
 * @param {string[]} addresses Array of ETH addresses of accounts
 * @returns {Object[]} Array of Account model instances
 * @throws {Error} If one or more accounts could not be found
 */
const getAccountsByAddresses = async (addresses) => {
  try {
    const accounts = await Account.findAll({
      where: {
        address: {
          [Op.or]: addresses,
        },
      },
    });
    if (addresses.length > accounts.length) {
      throw '';
    }
    return accounts;
  } catch (e) {
    throw 'One or more accounts could not be found';
  }
};

module.exports = getAccountsByAddresses;
