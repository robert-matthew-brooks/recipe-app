const recipesModel = require('../models/recipes-model');

async function getOne(req, res, next) {
  const { recipe_slug: slug } = req.params;

  try {
    const { recipe } = await recipesModel.getOne(slug);
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
    is_todos: isTodos,
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
      isTodos,
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

async function patchRecipe(req, res, next) {
  const token = req.headers?.authorization?.split(' ')[1];
  const { recipe_slug: slug } = req.params;
  const {
    name,
    ingredients,
    new_ingredients: newIngredients,
    steps,
  } = req.body;

  try {
    const { recipe } = await recipesModel.patchRecipe(
      slug,
      name,
      ingredients,
      newIngredients,
      steps,
      token
    );
    res.send({ recipe });
  } catch (err) {
    next(err);
  }
}

async function deleteRecipe(req, res, next) {
  const token = req.headers?.authorization?.split(' ')[1];
  const { recipe_slug: slug } = req.params;

  try {
    await recipesModel.deleteRecipe(slug, token);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getOne, getMany, patchRecipe, deleteRecipe };
