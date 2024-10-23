const { Model, DataTypes } = require('sequelize');

const sequelize = require('./../config/config');
const Account = require('./account');
const Wallet = require('./wallet');

class WalletUser extends Model {}

WalletUser.init(
  {
    AccountId: {
      type: DataTypes.INTEGER,
      references: {
        model: Account,
        key: 'id',
      },
    },
    WalletId: {
      type: DataTypes.INTEGER,
      references: {
        model: Wallet,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'WalletUser',
  }
);

module.exports = WalletUser;
