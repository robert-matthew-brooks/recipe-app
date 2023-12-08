const recipesModel = require('../models/recipes-model');

async function getOne(req, res) {
  const { recipe_id: recipeId } = req.params;

  // TODO wrap in try/catch, pass to custom error handler
  const { recipe } = await recipesModel.getOne(recipeId);
  res.send({ recipe });
}

async function getAll(req, res) {
  const { recipes } = await recipesModel.getAll();
  res.send({ recipes });
}

module.exports = { getOne, getAll };
