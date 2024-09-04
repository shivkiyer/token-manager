const { Sequelize } = require('sequelize');


let dbName, dbUsername, dbPassword, dbHost, dbPort;
if (process.env.NODE_ENV === 'development') {
  dbName = process.env.DB_DEV_NAME;
  dbUsername = process.env.DB_DEV_USERNAME;
  dbPassword = process.env.DB_DEV_PASSWORD;
  dbHost = process.env.DB_DEV_HOST;
  dbPort = process.env.DB_DEV_PORT;
} else if (process.env.NODE_ENV === 'test') {
  dbName = process.env.DB_TEST_NAME;
  dbUsername = process.env.DB_TEST_USERNAME;
  dbPassword = process.env.DB_TEST_PASSWORD;
  dbHost = process.env.DB_TEST_HOST;
  dbPort = process.env.DB_TEST_PORT;
}

/**
 * Creates db connection and exports for app-wide use
 */
const sequelize = new Sequelize(
  dbName,
  dbUsername,
  dbPassword,
  {
    host: dbHost,
    dialect: 'postgres',
    port: dbPort,
    // Disable SQL statements in backend console
    logging: false,
  }
);

module.exports = sequelize;
