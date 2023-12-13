const express = require('express');
const usersController = require('../controllers/users-controller');

const usersRouter = express.Router();

usersRouter.get('/availability/:username', usersController.getAvailability);

module.exports = usersRouter;
