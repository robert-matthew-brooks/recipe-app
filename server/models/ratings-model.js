const pool = require('../db/pool');
const { verifyToken } = require('../util/token');
const validate = require('../util/validate');

async function get(token, recipeSlug) {
  const userId = verifyToken(token).id;
  await validate.rejectIfNotInDb(recipeSlug, 'slug', 'recipes');

  const { rows } = await pool.query(
    `
      SELECT ra.stars
      FROM ratings ra
      INNER JOIN recipes r
      ON ra.recipe_id = r.id
      WHERE ra.user_id = $1
      AND r.slug = $2;
    `,
    [userId, recipeSlug]
  );

  const rating = rows[0]?.stars;

  return { rating };
}

async function put(token, recipeSlug, rating) {
  const userId = verifyToken(token).id;
  await Promise.all([
    validate.rejectIfNotInDb(recipeSlug, 'slug', 'recipes'),
    validate.rejectIfFailsRegex({ rating }, '^[1-5]$'),
  ]);

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

  // remove existing vote
  await pool.query(
    `
      DELETE FROM ratings
      WHERE user_id = $1
      AND recipe_id = $2;
    `,
    [userId, recipeId]
  );

  // add new vote
  await pool.query(
    `
      INSERT INTO ratings
        (user_id, recipe_id, stars)
      VALUES
        ($1, $2, $3);
    `,
    [userId, recipeId, rating]
  );
}

async function del(token, recipeSlug) {
  const userId = verifyToken(token).id;
  await validate.rejectIfNotInDb(recipeSlug, 'slug', 'recipes');

  await pool.query(
    `
      DELETE FROM ratings ra
      USING recipes r
      WHERE ra.recipe_id = r.id
      AND ra.user_id = $1
      AND r.slug = $2;
    `,
    [userId, recipeSlug]
  );
}

module.exports = { get, put, del };
