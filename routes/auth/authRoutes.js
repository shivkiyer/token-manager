const express = require('express');
const router = express.Router({ mergeParams: true });

const authController = require('./../../controllers/auth/authController');
const loginRequired = require('./../../middleware/loginRequired');

router.post('/login', async (req, res) => {
  const response = await authController.login(req, res);
  return response;
});

router.post('/signup', async (req, res) => {
  const response = await authController.signUp(req, res);
  return response;
});

router.get('/search', loginRequired, async (req, res) => {
  const response = await authController.searchUser(req, res);
  return response;
})

module.exports = router;
