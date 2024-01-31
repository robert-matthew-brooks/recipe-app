const ingredientsModel = require('../models/ingredients-model');

async function getAll(req, res, next) {
  try {
    const { ingredients } = await ingredientsModel.getAll();
    res.send({ ingredients });
  } catch (err) {
    next(err);
  }
}

async function getShoppingList(req, res, next) {
  const token = req.headers?.authorization?.split(' ')[1];

  try {
    const { ingredients } = await ingredientsModel.getShoppingList(token);
    res.send({ ingredients });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getShoppingList };
