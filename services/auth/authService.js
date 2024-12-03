const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const User = require('./../../db/models/user');

const emailValidator = require('./../../utils/auth/emailValidator');
const hashPassword = require('./../../utils/auth/hashPassword');
const getUserFromEmail = require('./../../utils/auth/getUserFromEmail');

/**
 * Creates new user in database
 * @param {string} username
 * @param {string} password
 * @returns {string} username
 * @throws Error if username is not a valid email
 * @throws Error if username exists in database
 * @throws Error if password could not be encrypted
 */
const signUp = async ({ username, password, name, designation }) => {
  if (!emailValidator(username)) {
    throw 'Username not a valid email address';
  }
  try {
    const checkUsername = await User.findOne({ where: { username } });
    if (checkUsername !== null) {
      throw 'Username already exists';
    }
    const encryptedPassword = await hashPassword(password);
    await User.create({
      username,
      password: encryptedPassword,
      name,
      designation,
    });
    return username;
  } catch (e) {
    throw e;
  }
};

/**
 * Verifies a login request
 * @param {string} username
 * @param {string} password
 * @returns {string} JWT
 * @throws {401} If username not found
 * @throws {401} If username/password do not match
 */
const login = async (username, password) => {
  try {
    const checkUser = await User.findOne({ where: { username } });
    if (checkUser === null) {
      throw 'User not found';
    }
    const encryptedPassword = checkUser.password;
    const passwordMatch = await bcrypt.compare(password, encryptedPassword);
    if (passwordMatch) {
      const jwtToken = await jwt.sign(
        { data: username },
        process.env.JWT_SECRET,
        { expiresIn: parseInt(process.env.SESSION_EXPIRY) * 60 }
      );
      return jwtToken;
    }
    throw 'Login failed';
  } catch (e) {
    throw e;
  }
};

/**
 * Searching for users using email, name or designation
 * @param {string} searchString
 * @returns {Object} List of users
 * @throws {Error} If no user found
 */
const searchUser = async (searchString) => {
  try {
    const users = await User.findAll({
      where: {
        [Op.or]: {
          username: { [Op.like]: '%' + searchString + '%' },
          name: { [Op.like]: '%' + searchString + '%' },
          designation: { [Op.like]: '%' + searchString + '%' },
        },
      },
    });
    if (users.length === 0) {
      throw '';
    }
    const usersData = users.map((user) => {
      return {
        username: user.username,
        name: user.name,
        designation: user.designation,
      };
    });
    return usersData;
  } catch (e) {
    throw 'No user found';
  }
};

module.exports = {
  signUp,
  login,
  searchUser,
};
