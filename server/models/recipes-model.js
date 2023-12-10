const pool = require('../db/pool');
const { rejectIfFailsRegex, rejectIfNotInDb } = require('../util/validate');

async function getOne(recipeId) {
  rejectIfFailsRegex({ recipeId }, '^[\\d]+$');
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
        r.steps,
        r.is_vegetarian
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

async function getAll(searchTerm = '', isVegetarian) {
  rejectIfFailsRegex({ searchTerm }, '^[\\w\\s%]*$');

  const { rows } = await pool.query(
    `
      SELECT
        r.id,
        r.name
      FROM recipes_ingredients ri
      INNER JOIN recipes r
        ON r.id = ri.recipe_id
        AND LOWER(r.name) LIKE LOWER($1)
        AND r.is_vegetarian IS NOT ${isVegetarian ? 'FALSE' : 'NULL'}
      GROUP BY r.id;
    `,
    [`%${searchTerm}%`]
  );

  return { recipes: rows };
}

module.exports = { getOne, getAll };
