const pool = require('../db/pool');
const format = require('pg-format');
const { verifyToken } = require('../util/token');
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
        r.img_url,
        JSON_AGG (
          DISTINCT JSONB_BUILD_OBJECT (
            'name', i.name,
            'amount', ri.amount,
            'units', i.units
          )
        ) AS ingredients,
        r.steps,
        r.is_vegetarian,
        r.created_at,
        COUNT(DISTINCT ra)::INT AS votes,
        AVG(DISTINCT ra.stars)::FLOAT AS rating
      FROM recipes r
      INNER JOIN users u
        ON r.author_id = u.id
      INNER JOIN recipes_ingredients ri
        ON r.id = ri.recipe_id
        AND r.slug = $1
      INNER JOIN ingredients i
        ON ri.ingredient_id = i.id
      LEFT OUTER JOIN ratings ra
        ON r.id = ra.recipe_id
      GROUP BY
        r.id,
        u.username;
    `,
    [recipeSlug]
  );

  return { recipe: rows[0] };
}

async function getMany(
  searchTerm = '',
  ingredientIds = [],
  isFavourites,
  isVegetarian,
  sort = 'new',
  limit = 10,
  page = 1,
  token
) {
  isFavourites = !!isFavourites;
  const userId = isFavourites ? verifyToken(token).id : null;
  isVegetarian = !!isVegetarian;
  const offset = limit * (page - 1);
  const lookupSort = {
    new: 'r.created_at DESC',
    top: 'votes DESC',
    az: 'r.name',
    za: 'r.name DESC',
  };

  validate.rejectIfFailsRegex({ searchTerm }, '^[\\w\\s%]*$');
  ingredientIds.forEach((ingredientId) => {
    validate.rejectIfFailsRegex({ ingredientId }, '^\\d+$');
  });
  validate.rejectIfNotInList({ sort }, Object.keys(lookupSort));
  validate.rejectIfFailsRegex({ limit, page }, '^\\d+$');

  // optional sql query strings

  const ingredientsQueryStr =
    ingredientIds.length > 0
      ? format(
          `
            INNER JOIN (
              SELECT
                grouped_i.recipe_id
              FROM (
                SELECT
                  ri.recipe_id,
                  ARRAY_AGG(ri.ingredient_id) as ingredient_ids
                FROM
                  recipes_ingredients ri
                GROUP BY ri.recipe_id
              ) grouped_i
              WHERE grouped_i.ingredient_ids @> ARRAY[%s]
            ) filtered_i
              ON r.id = filtered_i.recipe_id
          `,
          ingredientIds
        )
      : '';

  const favouritesQueryStr = isFavourites
    ? format(
        `
          INNER JOIN (
            SELECT favourites.recipe_id
            FROM favourites
            WHERE favourites.user_id = ${userId}
          ) f
            ON r.id = f.recipe_id
        `
      )
    : '';

  const vegetarianQueryStr = isVegetarian ? 'AND r.is_vegetarian IS TRUE' : '';

  const orderByQueryStr = lookupSort[sort];

  // get paginated recipes

  const { rows: recipes } = await pool.query(
    `
      SELECT
        r.id,
        r.name,
        r.slug,
        u.username AS author,
        r.img_url,
        r.created_at,
        COUNT(DISTINCT ra)::INT AS votes,
        AVG(DISTINCT ra.stars)::FLOAT AS rating
      FROM (
        SELECT * FROM recipes r
        WHERE LOWER(r.name) LIKE LOWER($1)
        ${vegetarianQueryStr}
      ) r
      ${favouritesQueryStr}
      ${ingredientsQueryStr}
      INNER JOIN users u
        ON r.author_id = u.id
      LEFT OUTER JOIN ratings ra
        ON r.id = ra.recipe_id
      GROUP BY
        r.id,
        r.name,
        r.slug,
        u.username,
        r.img_url,
        r.created_at
      ORDER BY ${orderByQueryStr}
      LIMIT $2 OFFSET $3;
    `,
    [`%${searchTerm}%`, limit, offset]
  );

  // get total number of matches

  const { rows } = await pool.query(
    `
      SELECT
        COUNT(*)::INT AS total_recipes
      FROM (
        SELECT
          r.id
        FROM (
          SELECT * FROM recipes r
          WHERE LOWER(r.name) LIKE LOWER($1)
          ${vegetarianQueryStr}
        ) r
        ${favouritesQueryStr}
        ${ingredientsQueryStr}
      ) count;
    `,
    [`%${searchTerm}%`]
  );

  return { recipes, total_recipes: rows[0].total_recipes };
}

module.exports = { getOne, getMany };
