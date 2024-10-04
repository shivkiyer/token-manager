const express = require('express');
const router = express.Router({ mergeParams: true });

const loginRequired = require('./../../middleware/loginRequired');
const ethAccountsController = require('./../../controllers/ethAccounts/ethAccountsController');

router.use(loginRequired);

router.post('/add', async (req, res) => {
  const response = ethAccountsController.addAccount(req, res);
  return response;
});

module.exports = router;
