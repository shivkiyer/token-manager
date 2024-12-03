const User = require('../../db/models/user');
const Account = require('./../../db/models/account');

/**
 * Check if username is the owner of a wallet
 * @param {Object} user User model instance
 * @param {Object} wallet Wallet model instance
 * @returns {boolean}
 */
const isUserWalletOwner = async (user, wallet) => {
  try {
    const walletOwner = await Account.findOne({
      where: { id: wallet.ownerId },
    });
    if (walletOwner.userId === user.id) {
      return true;
    }
  } catch (e) {}
  return false;
};

module.exports = isUserWalletOwner;
