const express = require('express');
const ingredientsController = require('../controllers/ingredients-controller');

const ingredientsRouter = express.Router();

ingredientsRouter.get('/', ingredientsController.getAll);
ingredientsRouter.get('/shopping-list', ingredientsController.getShoppingList);

module.exports = ingredientsRouter;
