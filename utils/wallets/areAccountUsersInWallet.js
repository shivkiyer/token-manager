const { Op } = require('sequelize');

const WalletUser = require('./../../db/models/walletUser');

/**
 * Checks if accounts are already added to a wallet as users
 * @param {Object[]} accounts Array of Account model instances
 * @param {Objec} wallet Wallet model instance
 * @returns {boolean}
 */
const areAccountUsersInWallet = async (accounts, wallet) => {
  const accountsInWallet = await WalletUser.findAll({
    where: {
      AccountId: {
        [Op.or]: accounts.map((accItem) => accItem.id),
      },
      WalletId: wallet.id,
    },
  });
  if (accountsInWallet.length > 0) {
    return true;
  }
  return false;
};

module.exports = areAccountUsersInWallet;
