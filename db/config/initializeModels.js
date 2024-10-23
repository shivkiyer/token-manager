const User = require('./../models/user');
const Account = require('./../models/account');
const Wallet = require('./../models/wallet');
const WalletUser = require('./../models/walletUser');

/**
 * Establish relations between models and create/update them
 */
const initializeModels = async () => {
  try {
    User.hasMany(Account, { foreignKey: 'userId' });
    Account.belongsTo(User, { foreignKey: 'userId' });

    Account.hasMany(Wallet, { foreignKey: 'ownerId' });
    Wallet.belongsTo(Account, { as: 'owner', foreignKey: 'ownerId' });

    Wallet.belongsToMany(Account, { through: 'WalletUser', as: 'user' });
    Account.belongsToMany(Wallet, {
      through: 'WalletUser',
      as: 'expenseAccount',
    });

    Wallet.belongsToMany(Account, { through: 'WalletAdmin', as: 'admin' });
    Account.belongsToMany(Wallet, {
      through: 'WalletAdmin',
      as: 'managedAccount',
    });

    await User.sync({ alter: true });
    await Account.sync({ alter: true });
    await Wallet.sync({ alter: true });
    await WalletUser.sync({ alter: true });
  } catch (e) {
    console.log(e);
    console.log('Database synchronization error');
    console.log(e.message);
  }
};

module.exports = initializeModels;
