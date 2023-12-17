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
  const {
    search_term: searchTerm,
    ingredient_ids: ingredientIdsStr,
    is_vegetarian: isVegetarianStr,
    sort: sortStr,
    limit,
    page,
  } = req.query;

  try {
    const { recipes } = await recipesModel.getMany(
      searchTerm,
      ingredientIdsStr,
      isVegetarianStr,
      sortStr,
      limit,
      page
    );
    res.send({ recipes });
  } catch (err) {
    next(err);
  }
}

module.exports = { getOne, getMany };
