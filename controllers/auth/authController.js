const authService = require('./../../services/auth/authService');

/**
 * Controller for registering new user
 * @param {Object} req Request
 * @param {Object} res Response
 * @returns {Object} Property data with value username
 * @throws {400} If username is missing
 * @throws {400} If password is missing
 * @throws {400} If username is not valid email
 * @throws {400} If username already exists in database
 */
const signUp = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === null || username === undefined) {
    return res.status(400).send({
      message: 'Username is required',
    });
  }
  if (password === null || password === undefined) {
    return res.status(400).send({
      message: 'Password is required',
    });
  }

  try {
    const newUser = await authService.signUp(username, password);
    return res.send({ data: newUser });
  } catch (e) {
    return res.status(400).send(e);
  }
};

module.exports = {
  signUp,
};
