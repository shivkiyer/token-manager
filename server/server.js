const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

const sequelize = require('./../db/config/config');
const setupRoutes = require('./../routes/routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(cors());
}

const logger = require('./logger');
app.use(logger);

setupRoutes(app);

// Test connection to database and start server
const server = app.listen(process.env.DEV_SERVER_PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Listening on port ${process.env.DEV_SERVER_PORT}`);
    sequelize
      .authenticate()
      .then(() => {
        console.log(`Connected to database`);
      })
      .catch(() => {
        console.log('Connection to database failed. Server not started.');
        process.exit(1);
      });
  }
});

module.exports = server;
