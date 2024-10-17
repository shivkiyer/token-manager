const authRoutes = require('./auth/authRoutes');
const ethAccounts = require('./ethAccounts/ethAccountsRoutes');
const contractFactoryRoutes = require('./contractFactory/contractFactoryRoutes');
const walletRoutes = require('./wallets/walletRoutes');

/**
 * Merging all the routes in the app
 * @param {Object} app Express instance created at startup
 */
const appRoutes = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/eth-accounts', ethAccounts);
  app.use('/api/contract-factory', contractFactoryRoutes);
  app.use('/api/wallets', walletRoutes);
};

module.exports = appRoutes;
