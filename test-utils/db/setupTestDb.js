const sequelize = require('./../../db/config/config');
const initializeModels = require('./../../db/config/initializeModels');

/**
 * Updates test database tables based on models
 * @returns {Object} Database connection instance
 */
const setupTestDb = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.dropAllSchemas();
    await initializeModels();
    return sequelize;
  } catch (e) {
    console.log('Setting up test database failed');
    console.log(e);
    process.exit(1);
  }
};

module.exports = setupTestDb;
