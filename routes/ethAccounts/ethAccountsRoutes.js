const express = require('express');
const router = express.Router({ mergeParams: true });

const loginRequired = require('./../../middleware/loginRequired');
const ethAccountsController = require('./../../controllers/ethAccounts/ethAccountsController');

router.use(loginRequired);

router.get('/', async (req, res) => {
  const response = await ethAccountsController.getAccounts(req, res);
  return response;
});

router.post('/add', async (req, res) => {
  const response = await ethAccountsController.addAccount(req, res);
  return response;
});

module.exports = router;
