const ingredientsModel = require('../models/ingredients-model');

async function getIngredients(req, res, next) {
  try {
    const { ingredients } = await ingredientsModel.getIngredients();
    res.send({ ingredients });
  } catch (err) {
    next(err);
  }
}

module.exports = { getIngredients };
