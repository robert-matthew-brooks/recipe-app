const pool = require('../db/pool');
const format = require('pg-format');
const validate = require('../util/validate');

async function getOne(recipeSlug) {
  await validate.rejectIfNotInDb(recipeSlug, 'slug', 'recipes');

  const { rows } = await pool.query(
    `
      SELECT
        r.id,
        r.name,
        r.slug,
        u.username AS author,
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
      INNER JOIN users u
        ON r.author_id = u.id
      INNER JOIN recipes_ingredients ri
        ON r.id = ri.recipe_id
        AND r.slug = $1
      INNER JOIN ingredients i
        ON ri.ingredient_id = i.id
      LEFT OUTER JOIN recipe_likes l
        ON r.id = l.recipe_id
      GROUP BY
        r.id,
        u.username;
    `,
    [recipeSlug]
  );

  return { recipe: rows[0] };
}

async function getAll(searchTerm, ingredientIdsStr, isVegetarianStr) {
  const ingredientIds = ingredientIdsStr ? JSON.parse(ingredientIdsStr) : [];
  const isVegetarian = !!isVegetarianStr;

  validate.rejectIfFailsRegex({ searchTerm }, '^[\\w\\s%]*$');
  ingredientIds.forEach((ingredientId) => {
    validate.rejectIfFailsRegex({ ingredientId }, '^\\d+$');
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
        u.username AS author,
        COUNT(DISTINCT l)::INT AS likes
      FROM recipes r
      INNER JOIN users u
        ON r.author_id = u.id
      INNER JOIN recipes_ingredients ri
        ON r.id = ri.recipe_id
        ${searchTerm ? searchTermQueryStr : ''}
        ${ingredientIds.length > 0 ? ingredientsQueryStr : ''}
        ${isVegetarian ? vegetarianQueryStr : ''}
      LEFT OUTER JOIN recipe_likes l
        ON r.id = l.recipe_id
      GROUP BY
        r.id,
        u.username;
    `
  );

  return { recipes: rows };
}

module.exports = { getOne, getAll };
