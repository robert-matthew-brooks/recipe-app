const express = require('express');
const ingredientsController = require('../controllers/ingredients-controller');

const ingredientsRouter = express.Router();

ingredientsRouter.get('/', ingredientsController.getIngredients);

module.exports = ingredientsRouter;
