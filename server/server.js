const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

// Connect to the database and sync models/tables
const sequelize = require('./../db/config/config');
if (process.env.NODE_ENV !== 'test') {
  // For tests, models initialized within tests
  require('./../db/config/initializeModels')();
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(cors());
}

// Register logger
const logger = require('./logger');
app.use(logger);

// Register API endpoints
const setupRoutes = require('./../routes/routes');
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
