const User = require('../../db/models/user');

/**
 * Check if username is the owner of a wallet
 * @param {string} username User email
 * @param {Object} wallet Wallet model instance
 * @returns {boolean}
 */
const isUserWalletOwner = async (username, wallet) => {
  const user = await User.findOne({ where: { username } });
  if (wallet.ownerId === user.id) {
    return true;
  }
  return false;
};

module.exports = isUserWalletOwner;
