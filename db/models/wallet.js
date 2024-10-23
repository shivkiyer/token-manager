const { Model, DataTypes } = require('sequelize');

const sequelize = require('./../config/config');

class Wallet extends Model {}

Wallet.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(600),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    maxLimit: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Wallet',
  }
);

module.exports = Wallet;
