const express = require('express');
const { verifyToken } = require('../util/token');
const usersController = require('../controllers/users-controller');

const usersRouter = express.Router();

usersRouter.get('/availability/:username', usersController.getAvailability);
usersRouter.post('/register', usersController.register);
usersRouter.post('/login', usersController.login);

module.exports = usersRouter;
