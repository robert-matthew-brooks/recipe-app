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

// const token = req.headers?.authorization?.split(' ')[1];

module.exports = { getAvailability };
