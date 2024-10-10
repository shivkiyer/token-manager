require('dotenv').config();
const jwt = require('jsonwebtoken');

/**
 * Creates a JWT for a user
 * @param {string} username Test user
 * @param {number} expiresIn (optional, default 60s) Time in seconds until expiry
 * @returns {string} JWT
 */
const createTestJwt = async (username, expiresIn) => {
  if (expiresIn === undefined) {
    expiresIn = 60;
  }
  const token = await jwt.sign({ data: username }, process.env.JWT_SECRET, {
    expiresIn,
  });
  return token;
};

module.exports = createTestJwt;
