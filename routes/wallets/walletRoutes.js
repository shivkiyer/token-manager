const express = require('express');
const router = express.Router({ mergeParams: true });

const loginRequired = require('./../../middleware/loginRequired');
const walletController = require('./../../controllers/wallets/walletController');

router.use(loginRequired);

router.post('/create', async (req, res) => {
  const response = await walletController.createWallet(req, res);
  return response;
});

router.post('/:address/add-user', async (req, res) => {
  const response = await walletController.addUser(req, res);
  return response;
});

module.exports = router;
