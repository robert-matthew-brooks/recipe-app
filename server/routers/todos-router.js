const express = require('express');
const todosController = require('../controllers/todos-controller');

const todosRouter = express.Router();

todosRouter.get('/', todosController.getAll);
todosRouter.put('/:recipe_slug', todosController.put);
todosRouter.delete('/:recipe_slug', todosController.del);

module.exports = todosRouter;
