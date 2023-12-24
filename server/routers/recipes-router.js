const express = require('express');
const recipesController = require('../controllers/recipes-controller');

const recipesRouter = express.Router();

recipesRouter.get('/:recipe_slug', recipesController.getOne);
recipesRouter.post('/', recipesController.getMany);

module.exports = recipesRouter;
