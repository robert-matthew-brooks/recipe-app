const usersModel = require('../models/users-model');

async function getAvailability(req, res, next) {
  const { username } = req.params;

  try {
    const { user } = await usersModel.getAvailability(username);
    res.send({ user });
  } catch (err) {
    next(err);
  }
}

async function getRecipes(req, res, next) {
  const token = req.headers?.authorization?.split(' ')[1];

  try {
    const { recipes } = await usersModel.getRecipes(token);
    res.send({ recipes });
  } catch (err) {
    next(err);
  }
}

async function patchUser(req, res, next) {
  const token = req.headers?.authorization?.split(' ')[1];
  const { username, password } = req.body;

  try {
    const { user } = await usersModel.patchUser(username, password, token);
    res.send({ user });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  const token = req.headers?.authorization?.split(' ')[1];

  try {
    await usersModel.deleteUser(token);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAvailability, getRecipes, patchUser, deleteUser };
