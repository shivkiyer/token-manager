const express = require('express');
const router = express.Router({ mergeParams: true });

const loginRequired = require('./../../middleware/loginRequired');
const walletController = require('./../../controllers/wallets/walletController');

router.use(loginRequired);

router.post('/verify-wallet', async (req, res) => {
  const response = await walletController.verifyWallet(req, res);
  return response;
});

router.post('/create', async (req, res) => {
  const response = await walletController.createWallet(req, res);
  return response;
});

router.get('/get-abi', async (req, res) => {
  const response = await walletController.getAbi(req, res);
  return response;
});

router.get('/:address/get-users', async (req, res) => {
  const response = await walletController.getUsers(req, res);
  return response;
});

router.post('/:address/add-user', async (req, res) => {
  const response = await walletController.addUser(req, res);
  return response;
});

router.get('/:id', async (req, res) => {
  const response = await walletController.retrieveWalletDetails(req, res);
  return response;
});

router.get('', async (req, res) => {
  const response = await walletController.retrieveWallets(req, res);
  return response;
});

module.exports = router;
