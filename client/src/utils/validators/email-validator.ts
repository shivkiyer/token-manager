/**
 * Verifies if an email is valid
 *
 * @param {string} email Email
 * @returns {boolean} true if valid and false is not
 */
const emailValidator = (email: string): boolean => {
  const emailRegex =
    /^[-!#$%&'*+0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  if (!email) return false;

  if (email.length > 254) return false;

  const patternValid = emailRegex.test(email);
  if (!patternValid) return false;

  const parts = email.split('@');

  const domainParts = parts[1].split('.');
  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  )
    return false;

  return true;
};

export default emailValidator;
