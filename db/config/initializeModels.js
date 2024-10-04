const User = require('./../models/user');
const Account = require('./../models/account');

/**
 * Establish relations between models and create/update them
 */
const initializeModels = () => {
  User.hasMany(Account);
  Account.belongsTo(User);

  User.sync({ alter: true });
  Account.sync({ alter: true });
};

module.exports = initializeModels;
