const pool = require('../db/pool');
const { verifyToken, createToken } = require('../util/token');
const { hash } = require('../util/encrypt');
const validate = require('../util/validate');

async function getAvailability(username) {
  validate.rejectIfInvalidUsername(username);

  const { rows } = await pool.query(
    `
      SELECT username FROM users
      WHERE LOWER(username) = LOWER($1);
    `,
    [username]
  );

  const user = {
    username,
    is_available: rows.length === 0,
  };

  return { user };
}

module.exports = { getAvailability };
