const ratingsModel = require('../models/ratings-model');

async function get(req, res, next) {
  const token = req.headers?.authorization?.split(' ')[1];
  const { recipe_slug: recipeSlug } = req.params;

  try {
    const { rating } = await ratingsModel.get(token, recipeSlug);
    res.send({ rating });
  } catch (err) {
    next(err);
  }
}

async function put(req, res, next) {
  const token = req.headers?.authorization?.split(' ')[1];
  const { recipe_slug: recipeSlug } = req.params;
  const { rating } = req.body;

  try {
    await ratingsModel.put(token, recipeSlug, rating);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function del(req, res, next) {
  const token = req.headers?.authorization?.split(' ')[1];
  const { recipe_slug: recipeSlug } = req.params;

  try {
    await ratingsModel.del(token, recipeSlug);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { get, put, del };
