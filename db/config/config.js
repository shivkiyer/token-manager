const { Sequelize } = require('sequelize');

let DB_TYPE;
if (process.env.NODE_ENV === 'development') {
  DB_TYPE = 'DEV';
} else if (process.env.NODE_ENV === 'test') {
  DB_TYPE = 'TEST';
}

const dbName = process.env[`DB_${DB_TYPE}_NAME`];
const dbUsername = process.env[`DB_${DB_TYPE}_USERNAME`];
const dbPassword = process.env[`DB_${DB_TYPE}_PASSWORD`];
const dbHost = process.env[`DB_${DB_TYPE}_HOST`];
const dbPort = process.env[`DB_${DB_TYPE}_PORT`];

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
