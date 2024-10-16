const authService = require('./../../services/auth/authService');
const authDataValidator = require('./../../utils/auth/authDataValidator');

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
  const name = req.body.name;
  const designation = req.body.designation;

  const errMsg = authDataValidator(req.body);
  if (errMsg !== null) {
    req.log.error(`Error creating new user: ${errMsg}`);
    return res.status(400).send({ message: errMsg });
  }

  try {
    const newUser = await authService.signUp({
      username,
      password,
      name,
      designation,
    });
    req.log.info(`Successfully new user ${username}`);
    return res.status(201).send({ data: newUser });
  } catch (e) {
    req.log.error(`Error creating new user: ${e}`);
    return res.status(400).send({ message: e });
  }
};

/**
 * Controller for authenticating user
 * @param {Object} req Request
 * @param {Object} res Response
 * @returns {Object} Property data with JWT
 * @throws {400} If username not found
 * @throws {401} If login failed
 */
const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const errMsg = authDataValidator(req.body);
  if (errMsg !== null) {
    return res.status(400).send({ message: errMsg });
  }

  try {
    const loginStatus = await authService.login(username, password);
    req.log.info(`Successfully logged in ${username}`);
    res.send({ data: loginStatus });
  } catch (e) {
    req.log.error(`Error logging in ${username}: ${e}`);
    res.status(401).send({ message: e });
  }
};

module.exports = {
  signUp,
  login,
};
