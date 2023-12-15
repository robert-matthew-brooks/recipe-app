const express = require('express');
const ingredientsController = require('../controllers/ingredients-controller');

const ingredientsRouter = express.Router();

ingredientsRouter.use('/', ingredientsController.getIngredients);

module.exports = ingredientsRouter;
