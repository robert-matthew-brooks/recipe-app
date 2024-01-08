const pool = require('../db/pool');
const { verifyToken } = require('../util/token');
const validate = require('../util/validate');

async function getAll(token) {
  const userId = verifyToken(token).id;

  const { rows } = await pool.query(
    `
      SELECT ARRAY_AGG(r.slug) AS favourites
      FROM favourites f
      INNER JOIN recipes r
      ON f.recipe_id = r.id
      WHERE f.user_id = $1
      GROUP BY f.user_id;
    `,
    [userId]
  );

  const favourites = rows[0]?.favourites;

  return { favourites };
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
      INSERT INTO favourites
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
      DELETE FROM favourites f
      USING recipes r
      WHERE f.recipe_id = r.id
      AND f.user_id = $1
      AND r.slug = $2;
    `,
    [userId, recipeSlug]
  );
}

module.exports = { getAll, put, del };
