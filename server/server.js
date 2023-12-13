const express = require('express');
const { setEnvVars } = require('./env');
const recipesRouter = require('./routers/recipes-router');
const usersRouter = require('./routers/users-router');
const userController = require('./controllers/users-controller');
const errHandlers = require('./error-handlers/error-handlers');

setEnvVars();

const server = express();

server.use(express.json());
server.set('json spaces', 2);

server.get('/status', (_req, res) => {
  res.send('Server OK');
});

server.post('/register', userController.register);
server.post('/login', userController.login);

/**********/
/* routes */
/**********/

server.use('/recipes', recipesRouter);
server.use('/users', usersRouter);

/******************/
/* error handling */
/******************/

server.all('*', (_req, _res, next) => {
  next({ status: 404, msg: 'endpoint not found' });
});

server.use(errHandlers.customErrHandler);
server.use(errHandlers.serverErrHandler);

module.exports = server;
