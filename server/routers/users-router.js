const express = require('express');
const { verifyToken } = require('../util/token');
const usersController = require('../controllers/users-controller');

const usersRouter = express.Router();

usersRouter.use('/:username', usersController.getOne);

module.exports = usersRouter;
