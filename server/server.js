const express = require('express');
const app = express();
require('dotenv').config();
const routes = require('./../routes/routes');
const { Sequelize } = require('sequelize');

app.use('/api/', routes);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: 5432,
  }
);

/**
 * Test connection to database and start server
 */
const initSequelize = async () => {
  try {
    await sequelize.authenticate();
    const server = app.listen(8000, () =>
      console.log('Listening on port 8000')
    );
  } catch (e) {
    console.log('Connection to database failed. Server not started.');
  }
};
initSequelize();
