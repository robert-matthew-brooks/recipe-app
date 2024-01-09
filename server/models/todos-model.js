const pool = require('../db/pool');
const { verifyToken } = require('../util/token');
const validate = require('../util/validate');

async function getAll(token) {
  const userId = verifyToken(token).id;

  const { rows: todos } = await pool.query(
    `
      SELECT
        r.name,
        r.slug
      FROM todos t
      INNER JOIN recipes r
      ON t.recipe_id = r.id
      WHERE t.user_id = $1;
    `,
    [userId]
  );

  return { todos };
}

async function put(token, recipeSlug) {
  const userId = verifyToken(token).id;
  await validate.rejectIfNotInDb(recipeSlug, 'slug', 'recipes');

  // get recipeId
  const { rows } = await pool.query(
    `
      SELECT id
      FROM recipes
      WHERE slug = $1;
    `,
    [recipeSlug]
  );

  const recipeId = rows[0].id;

  await pool.query(
    `
      INSERT INTO todos
        (user_id, recipe_id)
      VALUES
        ($1, $2);
    `,
    [userId, recipeId]
  );
}

async function del(token, recipeSlug) {
  const userId = verifyToken(token).id;
  await validate.rejectIfNotInDb(recipeSlug, 'slug', 'recipes');

  await pool.query(
    `
      DELETE FROM todos t
      USING recipes r
      WHERE t.recipe_id = r.id
      AND t.user_id = $1
      AND r.slug = $2;
    `,
    [userId, recipeSlug]
  );
}

module.exports = { getAll, put, del };
