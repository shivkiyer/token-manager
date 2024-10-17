const Account = require('./../../db/models/account');
const Wallet = require('./../../db/models/wallet');

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

module.exports = {
  createWallet,
};
