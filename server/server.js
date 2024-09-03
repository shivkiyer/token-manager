const express = require('express');
const app = express();
require('dotenv').config();

const routes = require('./../routes/routes');
const sequelize = require('../db/config/config');

app.use('/api/', routes);

// Test connection to database and start server
sequelize
  .authenticate()
  .then(() => {
    const server = app.listen(process.env.DEV_SERVER_PORT, () =>
      console.log(`Listening on port ${process.env.DEV_SERVER_PORT}`)
    );
  })
  .catch(() => {
    console.log('Connection to database failed. Server not started.');
  });
