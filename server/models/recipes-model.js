const pool = require('../db/pool');
const format = require('pg-format');
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

async function getAll(searchTerm, ingredientIdsStr, isVegetarianStr) {
  const ingredientIds = ingredientIdsStr ? JSON.parse(ingredientIdsStr) : [];
  const isVegetarian = !!isVegetarianStr;

  rejectIfFailsRegex({ searchTerm }, '^[\\w\\s%]*$');
  ingredientIds.forEach((ingredientId) => {
    rejectIfFailsRegex({ ingredientId }, '^\\d+$');
  });

  // optional sql query strings

  const searchTermQueryStr = format(
    `AND LOWER(r.name) LIKE LOWER('%%%s%%')`, // (%%%s%%) --> (%searchTerm%), with %% as escape for %
    searchTerm
  );
  const ingredientsQueryStr = format(
    `AND ri.ingredient_id = ANY('{%s}')`,
    ingredientIds
  );
  const vegetarianQueryStr = 'AND r.is_vegetarian IS TRUE';

  const { rows } = await pool.query(
    `
      SELECT
        r.id,
        r.name
      FROM recipes_ingredients ri
      INNER JOIN recipes r
        ON r.id = ri.recipe_id
        ${searchTerm ? searchTermQueryStr : ''}
        ${ingredientIds.length > 0 ? ingredientsQueryStr : ''}
        ${isVegetarian ? vegetarianQueryStr : ''}
      GROUP BY r.id;
    `
  );

  return { recipes: rows };
}

module.exports = { getOne, getAll };
