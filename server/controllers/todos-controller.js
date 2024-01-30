const todosModel = require('../models/todos-model');
const recipesModel = require('../models/recipes-model');

async function getAll(req, res, next) {
  const token = req.headers?.authorization?.split(' ')[1];

  const { sort, limit, page } = req.query;

  try {
    const { recipes, total_recipes } = await recipesModel.getMany({
      isTodos: true,
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

async function put(req, res, next) {
  const token = req.headers?.authorization?.split(' ')[1];
  const { recipe_slug: recipeSlug } = req.params;

  try {
    await todosModel.put(token, recipeSlug);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function del(req, res, next) {
  const token = req.headers?.authorization?.split(' ')[1];
  const { recipe_slug: recipeSlug } = req.params;

  try {
    await todosModel.del(token, recipeSlug);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, put, del };
