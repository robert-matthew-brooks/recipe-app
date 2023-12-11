const express = require('express');
const usersController = require('../controllers/users-controller');

const usersRouter = express.Router();

usersRouter.use('/:user_name', usersController.getOne);

module.exports = usersRouter;
