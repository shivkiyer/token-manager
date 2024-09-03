const express = require('express');
const router = express.Router({ mergeParams: true });

const authController = require('./../../controllers/auth/authController');

router.post('/login', (req, res) => {
  res.send('Testing login');
});

router.post('/signup', async (req, res) => {
  const response = await authController.signUp(req, res);
  return response;
});

module.exports = router;
