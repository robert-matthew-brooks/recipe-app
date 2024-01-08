const favouritesModel = require('../models/favourites-model');

async function getAll(req, res, next) {
  const token = req.headers?.authorization?.split(' ')[1];

  try {
    const { favourites } = await favouritesModel.getAll(token);
    res.send({ favourites });
  } catch (err) {
    next(err);
  }
}

async function put(req, res, next) {
  const token = req.headers?.authorization?.split(' ')[1];
  const { recipe_slug: recipeSlug } = req.params;

  try {
    await favouritesModel.put(token, recipeSlug);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function del(req, res, next) {
  const token = req.headers?.authorization?.split(' ')[1];
  const { recipe_slug: recipeSlug } = req.params;

  try {
    await favouritesModel.del(token, recipeSlug);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, put, del };
