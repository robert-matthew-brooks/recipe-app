const express = require('express');
const recipesController = require('../controllers/recipes-controller');

const recipesRouter = express.Router();

recipesRouter.get('/:recipe_slug', recipesController.getOne);
recipesRouter.get('/', recipesController.getMany);
recipesRouter.patch('/:recipe_slug', recipesController.patchRecipe);
recipesRouter.post('/', recipesController.createRecipe);
recipesRouter.delete('/:recipe_slug', recipesController.deleteRecipe);

module.exports = recipesRouter;
