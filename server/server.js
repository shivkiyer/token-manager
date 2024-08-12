const express = require('express');
const app = express();
const routes = require('./../routes/routes');

app.use('/api/', routes);

const server = app.listen(8000, () => console.log('Listening on port 8000'));
