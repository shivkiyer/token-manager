const express = require('express');
const app = express();
require('dotenv').config();

const sequelize = require('./../db/config/config');
const setupRoutes = require('./../routes/routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
setupRoutes(app);

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
