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

async function getRecipes(token) {
  const userId = verifyToken(token).id;

  const { rows: recipes } = await pool.query(
    `
      SELECT
        slug,
        name
      FROM recipes
      WHERE author_id = $1
      ORDER BY name;
    `,
    [userId]
  );

  return { recipes };
}

async function patchUser(username, password, token) {
  validate.rejectIfInvalidUsername(username);
  validate.rejectIfInvalidPassword(password);
  const userId = verifyToken(token).id;

  const { rows } = await pool.query(
    `
      UPDATE users
      SET
        username = $1,
        lower_username = $2,
        hashed_password = $3
      WHERE id = $4
      RETURNING *;
    `,
    [username, username.toLowerCase(), hash(password), userId]
  );

  const newUser = { id: rows[0].id, username: rows[0].username };
  const newToken = createToken(newUser);
  newUser.token = newToken;

  return { user: newUser };
}

async function deleteUser(token) {
  const userId = verifyToken(token).id;

  await pool.query(
    `
      DELETE FROM users
      WHERE id = $1;
    `,
    [userId]
  );
}

module.exports = { getAvailability, getRecipes, patchUser, deleteUser };
