const pool = require('../db/pool');
const format = require('pg-format');
const { verifyToken } = require('../util/token');
const validate = require('../util/validate');
const { makeSqlArr, makeSlug } = require('../util/sql-functions');

async function getOne(slug) {
  await validate.rejectIfNotInDb(slug, 'slug', 'recipes');

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
            'id', i.id,
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
    [slug]
  );

  return { recipe: rows[0] };
}

async function getMany({
  searchTerm = '',
  ingredientIds = [],
  isFavourites,
  isTodos,
  isVegetarian,
  sort = 'new',
  limit = 10,
  page = 1,
  token,
}) {
  isFavourites = !!isFavourites;
  isTodos = !!isTodos;
  const userId = isFavourites || isTodos ? verifyToken(token).id : null;
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

  const todosQueryStr = isTodos
    ? format(
        `
          INNER JOIN (
            SELECT todos.recipe_id
            FROM todos
            WHERE todos.user_id = ${userId}
          ) t
            ON r.id = t.recipe_id
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
      ${todosQueryStr}
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
        ${todosQueryStr}
        ${ingredientsQueryStr}
      ) count;
    `,
    [`%${searchTerm}%`]
  );

  return { recipes, total_recipes: rows[0].total_recipes };
}

async function patchRecipe(
  slug,
  name,
  ingredients = [],
  newIngredients = [],
  steps = [],
  token
) {
  const userId = verifyToken(token).id;
  await Promise.all([validate.rejectIfNotInDb(slug, 'slug', 'recipes')]);
  validate.rejectIfFailsRegex(name, /^[\w,& ]+$/);

  for (const ingredient of ingredients) {
    validate.rejectIfFailsRegex(ingredient.id, /^\d+$/);
    validate.rejectIfFailsRegex(ingredient.amount, /^\d+$/);
  }
  for (const ingredient of newIngredients) {
    validate.rejectIfFailsRegex(ingredient.name, /^[\w ]+$/);
    validate.rejectIfFailsRegex(ingredient.units, /^[\w ]+$/);
    validate.rejectIfFailsRegex(ingredient.amount, /^\d+$/);
  }

  const { id: recipeId, author_id: authorId } = (
    await pool.query(
      `
        SELECT id, author_id
        FROM recipes
        WHERE slug = $1;
      `,
      [slug]
    )
  ).rows[0];

  if (authorId !== userId) {
    throw { status: 403, msg: 'token user does not match recipe author' };
  }

  // update main recipe
  const newSlug = makeSlug(name);

  await pool.query(
    `
      UPDATE recipes
      SET
        name = $2,
        slug = $3,
        steps = $4
      WHERE id = $1;
    `,
    [recipeId, name, newSlug, makeSqlArr(steps)]
  );

  // create ids for new ingredients, and append them to list
  if (newIngredients.length > 0) {
    const { rows: insertedIngredients } = await pool.query(
      format(
        `
        INSERT INTO ingredients (
          name,
          units
        )
        VALUES %L
        RETURNING id;
      `,
        newIngredients.map((ingredient) => [ingredient.name, ingredient.units])
      )
    );

    ingredients = [
      ...ingredients,
      ...newIngredients.map((ingredient, i) => {
        return { id: insertedIngredients[i].id, amount: ingredient.amount };
      }),
    ];
  }

  // update recipes-ingredients junction table
  await pool.query(
    `
      DELETE FROM recipes_ingredients
      WHERE recipe_id = $1;
    `,
    [recipeId]
  );

  await pool.query(
    format(
      `
        INSERT INTO recipes_ingredients (
          recipe_id,
          ingredient_id,
          amount
        )
        VALUES %L;
      `,

      ingredients.map((ingredient) => [
        recipeId,
        ingredient.id,
        ingredient.amount,
      ])
    )
  );

  return await getOne(newSlug);
}

async function deleteRecipe(slug, token) {
  const userId = verifyToken(token).id;
  await validate.rejectIfNotInDb(slug, 'slug', 'recipes');

  const { id: recipeId, author_id: authorId } = (
    await pool.query(
      `
        SELECT id, author_id
        FROM recipes
        WHERE slug = $1;
      `,
      [slug]
    )
  ).rows[0];

  if (authorId !== userId) {
    throw { status: 403, msg: 'token user does not match recipe author' };
  }

  await pool.query(
    `
      DELETE FROM recipes
      WHERE id = $1;
    `,
    [recipeId]
  );
}

module.exports = { getOne, getMany, patchRecipe, deleteRecipe };
