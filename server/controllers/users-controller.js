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

module.exports = { getAvailability };
