const express = require('express');
const router = express.Router({ mergeParams: true });

const loginRequired = require('./../../middleware/loginRequired');
const contractFactoryController = require('./../../controllers/contractFactory/contractFactoryController');

router.use(loginRequired);

router.get('/get-address', async (req, res) => {
  const response = await contractFactoryController.getAddress(req, res);
  return response;
});

router.get('/get-abi', async (req, res) => {
  const response = await contractFactoryController.getAbi(req, res);
  return response;
});

module.exports = router;
