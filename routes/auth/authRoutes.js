const express = require('express');
const router = express.Router({ mergeParams: true });

router.post('/login', (req, res) => {
  res.send('Testing login');
});

router.post('/signup', (req, res) => {
  res.send('Tesing signup');
});

module.exports = router;
