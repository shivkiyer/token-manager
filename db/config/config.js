const { Sequelize } = require('sequelize');

/**
 * Creates db connection and exports for app-wide use
 */
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    // Disable SQL statements in backend console
    logging: false,
  }
);

module.exports = sequelize;
