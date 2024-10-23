const { DataTypes } = require('sequelize');

const sequelize = require('./../config/config');
const Account = require('./account');
const Wallet = require('./wallet');

const WalletUser = sequelize.define('WalletUser', {
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
});

module.exports = WalletUser;
