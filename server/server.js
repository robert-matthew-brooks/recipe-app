const express = require('express');
const recipesRouter = require('./routers/recipes-router');

const server = express();

server.set('json spaces', 2);

server.get('/health', (_req, res) => {
  res.send('Server OK');
});

/**********/
/* routes */
/**********/

server.use('/recipes', recipesRouter);

/******************/
/* error handling */
/******************/

server.all('*', (_req, res) => {
  res.status(404).send('endpoint not found');
});

module.exports = server;
