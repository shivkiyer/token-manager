const User = require('./../../db/models/user');
const Account = require('./../../db/models/account');
const Wallet = require('./../../db/models/wallet');

/**
 * Fetch wallets owner by a user
 * @param {string} name Wallet name (optional)
 * @param {Object} user User model instance
 * @returns {Array} Array of wallets owner by user, filtered by name if provided
 */
const getWalletsByUser = async ({ name, user }) => {
  try {
    let searchByName = {};
    if (name !== undefined && name !== null) {
      searchByName = { name };
    }

    const wallets = await Wallet.findAll({
      where: searchByName,
      attributes: ['id', 'name', 'address', 'description', 'maxLimit'],
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
              required: true,
              where: { id: user.id },
            },
          ],
        },
      ],
    });
    return wallets;
  } catch (e) {
    throw 'Could not fetch wallets';
  }
};

module.exports = getWalletsByUser;
