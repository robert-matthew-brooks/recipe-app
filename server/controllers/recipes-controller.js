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
    ingredient_ids: ingredientIds,
    favourites_token: favouritesToken,
    is_vegetarian: isVegetarian,
    sort,
    limit,
    page,
  } = req.body;

  try {
    const { recipes, total_recipes } = await recipesModel.getMany(
      searchTerm,
      ingredientIds,
      favouritesToken,
      isVegetarian,
      sort,
      limit,
      page
    );
    res.send({ recipes, total_recipes });
  } catch (err) {
    next(err);
  }
}

module.exports = { getOne, getMany };
