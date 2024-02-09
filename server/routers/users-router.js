const express = require('express');
const usersController = require('../controllers/users-controller');

const usersRouter = express.Router();

usersRouter.get('/availability/:username', usersController.getAvailability);
usersRouter.get('/recipes', usersController.getRecipes);
usersRouter.patch('/', usersController.patchUser);
usersRouter.delete('/', usersController.deleteUser);

module.exports = usersRouter;
