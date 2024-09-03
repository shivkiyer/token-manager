const authRoutes = require('./auth/authRoutes');

/**
 * Merging all the routes in the app
 * @param {Object} app Express instance created at startup
 */
const appRoutes = (app) => {
  app.use('/api/auth', authRoutes);
};

module.exports = appRoutes;
