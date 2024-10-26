/**
 * Request body validator that checks for required fields
 * @param {Object} req Request
 * @param {string[]} bodyParams Array of fields
 * @returns Error if field is missing
 */
const requestDataValidator = (req, bodyParams) => {
  for (let i = 0; i < bodyParams.length; i++) {
    if (
      req.body[bodyParams[i]] === null ||
      req.body[bodyParams[i]] === undefined
    ) {
      return `${bodyParams[i]} is required`;
    }
  }
  return null;
};

module.exports = requestDataValidator;
