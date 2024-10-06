const User = require('./../../db/models/user');
const hashPassword = require('./../../utils/auth/hashPassword');

/**
 * Create a test user
 * @param {string} username Username/email
 * @param {string} password Password
 * @returns {Object} User object instance
 */
const createTestUser = async ({ username, password }) => {
  if (username === undefined || username === null) {
    username = 'abc@gmail.com';
  }
  if (password === undefined || password === null) {
    password = 'xyz';
  }
  const encrPassword = await hashPassword(password);

  const testUser = await User.create({
    username: username,
    password: encrPassword,
  });
  return testUser;
};

module.exports = createTestUser;
