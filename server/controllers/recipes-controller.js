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

async function getAll(req, res, next) {
  const {
    search_term: searchTerm,
    ingredient_ids: ingredientIdsStr,
    is_vegetarian: isVegetarianStr,
  } = req.query;

  try {
    const { recipes } = await recipesModel.getAll(
      searchTerm,
      ingredientIdsStr,
      isVegetarianStr
    );
    res.send({ recipes });
  } catch (err) {
    next(err);
  }
}

module.exports = { getOne, getAll };
