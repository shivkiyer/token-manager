const emailValidator = require('./../../utils/auth/emailValidator');
const hashPassword = require('./../../utils/auth/hashPassword');
const User = require('./../../db/models/user');

/**
 * Creates new user in database
 * @param {string} username
 * @param {string} password
 * @returns {string} username
 * @throws Error if username is not a valid email
 * @throws Error if username exists in database
 * @throws Error if password could not be encrypted
 */
const signUp = async (username, password) => {
  if (!emailValidator(username)) {
    throw { message: 'Username not a valid email address' };
  }
  try {
    const checkUsername = await User.findOne({ where: { username } });
    if (checkUsername !== null) {
      throw { message: 'Username already exists' };
    }
    const encryptedPassword = await hashPassword(password);
    await User.create({
      username,
      password: encryptedPassword,
    });
    return username;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  signUp,
};
