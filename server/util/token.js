const jwt = require('jsonwebtoken');
const { setEnvVars } = require('../env');

if (!process.env.TOKEN_SECRET) setEnvVars(); // read .env if called before server started
if (!process.env.TOKEN_SECRET) {
  console.log('token secret environment variable not set');
}

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
