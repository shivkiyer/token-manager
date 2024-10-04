const { DataTypes, Model } = require('sequelize');

const sequelize = require('./../config/config');

class Account extends Model {}

Account.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Account',
  }
);

module.exports = Account;
