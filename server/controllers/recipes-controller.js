const recipesModel = require('../models/recipes-model');

async function getOne(req, res, next) {
  const { recipe_id: recipeId } = req.params;

  try {
    const { recipe } = await recipesModel.getOne(recipeId);
    res.send({ recipe });
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res) {
  const { recipes } = await recipesModel.getAll();
  res.send({ recipes });
}

module.exports = { getOne, getAll };
