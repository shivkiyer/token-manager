const User = require('./../../db/models/user');

const ethAccountsService = require('./../../services/ethAccounts/ethAccountsService');

/**
 * Controller for adding new Ethereum account to authenticated user
 * @param {Object} req Request
 * @param {Object} res Response
 * @returns {Object} Name and address of account linked to user in database
 * @throws {400} If account name or address are missing
 * @throws {400} If account address is not unique
 * @throws {403} If user is not authenticated
 */
const addAccount = async (req, res) => {
  const { accountName, accountAddress } = req.body;
  if (
    accountName === undefined ||
    accountName === null ||
    accountAddress === undefined ||
    accountAddress === null
  ) {
    req.log.error('Empty account add request.');
    return res.status(400).send({ message: 'Account details missing.' });
  }

  try {
    const username = req.username;
    const { name, address } = await ethAccountsService.addAccount({
      username,
      accountName,
      accountAddress,
    });
    req.log.info(`Successfully added account ${name}`);
    res.status(201).send({ data: { name, address } });
  } catch (e) {
    req.log.error(`Error adding account - ${e}`);
    res.status(400).send({ message: e });
  }
};

module.exports = {
  addAccount,
};
