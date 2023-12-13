const pool = require('../db/pool');
const { verifyToken, createToken } = require('../util/token');
const { hash } = require('../util/encrypt');
const validate = require('../util/validate');

async function register(username, password) {
  validate.rejectIfInvalidUsername(username);
  validate.rejectIfInvalidPassword(password);

  const hashedPassword = hash(password);

  const { rows } = await pool.query(
    `
      INSERT INTO users (username, hashed_password)
      VALUES ($1, $2)
      RETURNING id, username;
    `,
    [username, hashedPassword]
  );

  const token = createToken(rows[0]);
  const user = { ...rows[0], token };

  return { user };
}

async function login(username, password, token) {
  if (username && password) {
    // validate
    //  - check format
    // retrieve from database
    // call createToken
  } else if (token) {
    const user = verifyToken(token);
    // retrieve from database
  } else {
    throw { status: 401, msg: 'No credentials or token provided' };
  }
}

async function getAvailability(username) {
  validate.rejectIfInvalidUsername(username);

  const { rows } = await pool.query(
    `
      SELECT username FROM users
      WHERE username = LOWER($1);
    `,
    [username]
  );

  const user = {
    username,
    is_available: rows.length === 0,
  };

  return { user };
}

module.exports = { register, login, getAvailability };
