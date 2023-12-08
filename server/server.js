const express = require('express');
const recipesRouter = require('./routers/recipes-router');
const errHandlers = require('./error-handlers/error-handlers');

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

server.use(errHandlers.customErrHandler);
server.use(errHandlers.serverErrHandler);

module.exports = server;
