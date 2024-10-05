const User = require('./../models/user');
const Account = require('./../models/account');

/**
 * Establish relations between models and create/update them
 */
const initializeModels = async () => {
  try {
    User.hasMany(Account);
    Account.belongsTo(User, { foreignKey: 'UserId' });

    await User.sync({ alter: true });
    await Account.sync({ alter: true });
  } catch (e) {
    console.log('Database synchronization error');
    console.log(e.message);
  }
};

module.exports = initializeModels;
