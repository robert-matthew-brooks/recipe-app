const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const tokenSecret = process.env.TOKEN_SECRET;

function createToken(user) {
  let token;
  let { id, username } = user;

  try {
    token = jwt.sign({ id, username }, tokenSecret, { expiresIn: '7d' });
  } catch (err) {
    throw err;
  }

  return token;
}

function verifyToken(token) {
  let user;

  if (!token) throw { status: 401, msg: 'No token provided' };

  try {
    user = jwt.verify(token, tokenSecret, {});
  } catch (err) {
    throw { status: 403, msg: 'Invalid token' };
  }

  return user;
}

module.exports = { createToken, verifyToken };
