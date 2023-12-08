const recipesModel = require('../models/recipes-model');

async function getOne(req, res) {
  const { recipe_id: recipeId } = req.params;

  // TODO wrap in try/catch, pass to custom error handler
  const { recipe } = await recipesModel.getOne(recipeId);
  res.status(200).send({ recipe });
}

module.exports = { getOne };
