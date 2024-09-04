/**
 * Verifies whether username and password
 * are present in request body
 * @param {Object} reqBody Request body
 * @returns
 */
const authDataValidator = (reqBody) => {
  const username = reqBody.username;
  const password = reqBody.password;

  if (username === null || username === undefined) {
    return 'Username is required';
  }
  if (password === null || password === undefined) {
    return 'Password is required';
  }

  return null;
};

module.exports = authDataValidator;
