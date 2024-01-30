const recipesModel = require('../models/recipes-model');

async function getOne(req, res, next) {
  const { recipe_slug: recipeSlug } = req.params;

  try {
    const { recipe } = await recipesModel.getOne(recipeSlug);
    res.send({ recipe });
  } catch (err) {
    next(err);
  }
}

async function getMany(req, res, next) {
  const token = req.headers?.authorization?.split(' ')[1];

  const {
    search_term: searchTerm,
    ingredient_ids: ingredientIdsStr,
    is_favourites: isFavourites,
    is_vegetarian: isVegetarian,
    sort,
    limit,
    page,
  } = req.query;

  const ingredientIds = ingredientIdsStr && JSON.parse(ingredientIdsStr);

  try {
    const { recipes, total_recipes } = await recipesModel.getMany({
      searchTerm,
      ingredientIds,
      isFavourites,
      isTodos: false,
      isVegetarian,
      sort,
      limit,
      page,
      token,
    });
    res.send({ recipes, total_recipes });
  } catch (err) {
    next(err);
  }
}

module.exports = { getOne, getMany };
