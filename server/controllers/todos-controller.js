const todosModel = require('../models/todos-model');

async function getAll(req, res, next) {
  const token = req.headers?.authorization?.split(' ')[1];

  try {
    const { todos } = await todosModel.getAll(token);
    res.send({ todos });
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
