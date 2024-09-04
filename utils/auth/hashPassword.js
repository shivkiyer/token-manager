const bcrypt = require('bcrypt');

const hashPassword = async (plaintextPassword) => {
  try {
    const salt = await bcrypt.genSalt(+process.env.PASSWORD_SALTING);
    const encryptedPassword = await bcrypt.hash(plaintextPassword, salt);
    return encryptedPassword;
  } catch (e) {
    throw 'Password encryption failed';
  }
};

module.exports = hashPassword;
