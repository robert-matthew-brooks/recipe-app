const usersModel = require('../models/users-model');
const { verifyToken } = require('../util/token');

async function register(req, res, next) {
  const { username, password } = req.body;

  try {
    const { user } = await usersModel.register(username, password);
    res.send({ user });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  const { username, password } = req.body;
  const token = req.headers?.authorization?.split(' ')[1];

  // return {user without password, + token}
}

async function getOne(req, res, next) {
  const { username } = req.params;

  try {
    const x = await verifyToken(req, next);

    const { user } = await usersModel.getOne(username);
    res.send({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getOne };
