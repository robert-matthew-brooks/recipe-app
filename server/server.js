const { setEnvVars } = require('./env');
const express = require('express');
const cors = require('cors');
const authRouter = require('./routers/auth-router');
const usersRouter = require('./routers/users-router');
const ingredientsRouter = require('./routers/ingredients-router');
const recipesRouter = require('./routers/recipes-router');
const favouritesRouter = require('./routers/favourites-router');
const ratingsRouter = require('./routers/ratings-router');
const errHandlers = require('./error-handlers/error-handlers');
const endpointsJson = require('./endpoints.json');

setEnvVars();

const server = express();
server.use(cors({ origin: process.env.CLIENT_ORIGIN }));
server.use(express.json());
server.set('json spaces', 2);

server.get('/', (_req, res) => {
  res.send(endpointsJson);
});

server.get('/status', (_req, res) => {
  res.send('Server OK');
});

/**********/
/* routes */
/**********/

server.use('/auth', authRouter);
server.use('/users', usersRouter);
server.use('/ingredients', ingredientsRouter);
server.use('/recipes', recipesRouter);
server.use('/favourites', favouritesRouter);
server.use('/ratings', ratingsRouter);

/******************/
/* error handling */
/******************/

server.all('*', (_req, _res, next) => {
  next({ status: 404, msg: 'endpoint not found' });
});

server.use(errHandlers.customErrHandler);
server.use(errHandlers.psqlErrHandler);
server.use(errHandlers.serverErrHandler);

module.exports = server;
