const pool = require('../db/pool');
const { rejectIfNotNumber, rejectIfNotInDb } = require('../util/validate');

async function getOne(recipeId) {
  rejectIfNotNumber({ recipeId });
  await rejectIfNotInDb('recipes', 'id', recipeId);

  const { rows } = await pool.query(
    `
      SELECT
        r.id,
        r.name,
        JSON_AGG (
          JSON_BUILD_OBJECT (
            'name', i.name,
            'amount', ri.amount,
            'units', i.units
          )
        ) AS ingredients,
        r.steps
      FROM recipes r
      INNER JOIN recipes_ingredients ri
        ON r.id = ri.recipe_id
        AND r.id = $1
      LEFT OUTER JOIN ingredients i
        ON i.id = ri.ingredient_id
      GROUP BY r.id;
    `,
    [recipeId]
  );

  return { recipe: rows[0] };
}

async function getAll() {
  // TODO get search term from request
  const searchTerm = '';

  const { rows } = await pool.query(
    `
      SELECT
        r.id,
        r.name
      FROM recipes_ingredients ri
      INNER JOIN recipes r
        ON r.id = ri.recipe_id
        AND r.name LIKE $1
      GROUP BY r.id;
    `,
    [`%${searchTerm}%`]
  );

  return { recipes: rows };
}

module.exports = { getOne, getAll };
