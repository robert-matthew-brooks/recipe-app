const pool = require('../db/pool');
const format = require('pg-format');
const { rejectIfFailsRegex, rejectIfNotInDb } = require('../util/validate');

async function getOne(recipeSlug) {
  await rejectIfNotInDb('recipes', 'slug', recipeSlug);

  const { rows } = await pool.query(
    `
      SELECT
        r.id,
        r.name,
        r.slug,
        JSON_AGG (
          DISTINCT JSONB_BUILD_OBJECT (
            'name', i.name,
            'amount', ri.amount,
            'units', i.units
          )
        ) AS ingredients,
        r.steps,
        r.is_vegetarian,
        COUNT(DISTINCT l)::INT AS likes
      FROM recipes r
      INNER JOIN recipes_ingredients ri
        ON r.id = ri.recipe_id
        AND r.slug = $1
      INNER JOIN ingredients i
        ON i.id = ri.ingredient_id
      LEFT OUTER JOIN recipe_likes l
        ON r.id = l.recipe_id
      GROUP BY r.id;
    `,
    [recipeSlug]
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
        r.name,
        r.slug,
        COUNT(DISTINCT l)::INT AS likes
      FROM recipes_ingredients ri
      INNER JOIN recipes r
        ON r.id = ri.recipe_id
        ${searchTerm ? searchTermQueryStr : ''}
        ${ingredientIds.length > 0 ? ingredientsQueryStr : ''}
        ${isVegetarian ? vegetarianQueryStr : ''}
      LEFT OUTER JOIN recipe_likes l
        ON r.id = l.recipe_id
      GROUP BY r.id;
    `
  );

  return { recipes: rows };
}

module.exports = { getOne, getAll };
