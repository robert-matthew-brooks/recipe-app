const usersModel = require('../models/users-model');

async function getOne(req, res, next) {
  const { user_name: userName } = req.params;

  try {
    const { user } = await usersModel.getOne(userName);
    res.send({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { getOne };
