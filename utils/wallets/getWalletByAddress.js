const Wallet = require('./../../db/models/wallet');

/**
 * Find Wallet by ETH address
 * @param {string} address ETH address of the Wallet contract
 * @returns {Object} Wallet model instance
 * @throws {Error} If wallet could not be found
 */
const getWalletByAddress = async (address) => {
  try {
    const wallet = await Wallet.findOne({ where: { address: address } });
    if (wallet === null || wallet === 'undefined') {
      throw '';
    }
    return wallet;
  } catch (e) {
    throw 'Wallet could not be found';
  }
};

module.exports = getWalletByAddress;
