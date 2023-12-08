const pool = require('../db/pool');

async function getOne(recipeId) {
  // TODO validate id

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

module.exports = { getOne };
