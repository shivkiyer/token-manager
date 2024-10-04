const authRoutes = require('./auth/authRoutes');
const ethAccounts = require('./ethAccounts/ethAccountsRoutes');

/**
 * Merging all the routes in the app
 * @param {Object} app Express instance created at startup
 */
const appRoutes = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/eth-accounts', ethAccounts);
};

module.exports = appRoutes;
