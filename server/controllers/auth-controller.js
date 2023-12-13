const authModel = require('../models/auth-model');

async function register(req, res, next) {
  const { username, password } = req.body;

  try {
    const { user } = await authModel.register(username, password);
    res.send({ user });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  const { username, password } = req.body;
  const token = req.headers?.authorization?.split(' ')[1];

  // return {id, username, token}
}

module.exports = { register, login };
