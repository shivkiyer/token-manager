const User = require('./../../db/models/user');

/**
 * Returns User object instance from email/username
 * @param {string} email Email/username
 * @returns {object} User object instance
 * @throws {Error} User not found error if email does not exist in database
 */
const getUserFromEmail = async (email) => {
  try {
    const user = await User.findOne({
      where: { username: email },
      attributes: ['id', 'username', 'name', 'designation'],
    });
    if (user === null) {
      throw '';
    }
    return user;
  } catch (e) {
    throw 'User not found';
  }
};

module.exports = getUserFromEmail;
