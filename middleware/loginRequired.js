const jwt = require('jsonwebtoken');

/**
 * Middleware for checking valid JWT in request header
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Object} next Continue with request handling
 * @returns {string} Username of authenticated user
 * @throws {403} If JWT is missing, invalid or expired
 */
const loginRequired = async (req, res, next) => {
  const authToken = req.headers['authorization'];
  if (authToken === undefined || authToken === null) {
    return res.status(403).send('Login required for this action.');
  }

  try {
    const payload = await jwt.verify(authToken, process.env.JWT_SECRET);
    if (
      payload.hasOwnProperty('data') &&
      payload['data'] !== null &&
      payload['data'] !== undefined
    ) {
      const username = payload['data'];
      req.username = username;
    } else {
      throw 'Error';
    }
  } catch (e) {
    return res.status(403).send('Authorization failed. Please login again.');
  }

  next();
};

module.exports = loginRequired;