const express = require('express');
const recipesController = require('../controllers/recipes-controller');

const recipesRouter = express.Router();

recipesRouter.get('/:recipe_slug', recipesController.getOne);
recipesRouter.get('/', recipesController.getAll);

module.exports = recipesRouter;
