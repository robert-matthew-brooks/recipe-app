const pool = require('../db/pool');
const { createToken } = require('../util/token');
const { hash, compare } = require('../util/encrypt');
const validate = require('../util/validate');

async function register(username, password) {
  validate.rejectIfInvalidUsername(username);
  validate.rejectIfInvalidPassword(password);

  const hashedPassword = hash(password);

  const { rows } = await pool.query(
    `
      INSERT INTO users (username, hashed_password)
      VALUES (LOWER($1), $2)
      RETURNING id, username;
    `,
    [username, hashedPassword]
  );

  const token = createToken(rows[0]);
  const user = { ...rows[0], token };

  return { user };
}

async function login(username, password) {
  validate.rejectIfInvalidUsername(username);
  validate.rejectIfInvalidPassword(password);

  const { rows } = await pool.query(
    `
      SELECT
        id,
        username,
        hashed_password
      FROM users
      WHERE username = LOWER($1);
    `,
    [username]
  );

  if (rows.length === 0) {
    throw { status: 404, msg: 'Username not found' };
  } else if (!compare(password, rows[0].hashed_password)) {
    throw { status: 403, msg: 'Incorrect password' };
  } else {
    const token = createToken(rows[0]);
    const user = { ...rows[0], token };

    return { user };
  }
}

module.exports = { register, login };