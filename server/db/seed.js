const pool = require('./pool');
const format = require('pg-format');

async function seed({ ingredients, recipes, users }) {
  /******************/
  /* util functions */
  /******************/

  const getId = async (name, table) => {
    const { rows } = await pool.query(
      format(
        `
          SELECT id FROM %s
          WHERE name = %L;
        `,
        table,
        name
      )
    );

    return rows[0].id;
  };

  /***************/
  /* drop tables */
  /***************/

  await pool.query('DROP TABLE IF EXISTS users_favourites CASCADE;');
  await pool.query('DROP TABLE IF EXISTS recipes_ingredients CASCADE;');
  await pool.query('DROP TABLE IF EXISTS ingredients CASCADE;');
  await pool.query('DROP TABLE IF EXISTS recipes CASCADE;');
  await pool.query('DROP TABLE IF EXISTS users CASCADE;');

  /*****************/
  /* create tables */
  /*****************/

  await pool.query(`
    CREATE TABLE ingredients (
      id SERIAL PRIMARY KEY,
      name VARCHAR UNIQUE NOT NULL,
      units VARCHAR
    );
  `);

  await pool.query(
    `
      CREATE TABLE recipes (
        id SERIAL PRIMARY KEY,
        name VARCHAR UNIQUE NOT NULL,
        steps VARCHAR[],
        is_vegetarian BOOLEAN
      );
    `
  );

  await pool.query(
    `
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR UNIQUE NOT NULL
      );
    `
  );

  // junction tables

  await pool.query(
    `
      CREATE TABLE recipes_ingredients (
        id SERIAL PRIMARY KEY,
        recipe_id INT REFERENCES recipes(id) NOT NULL,
        ingredient_id INT REFERENCES ingredients(id) NOT NULL,
        amount INT NOT NULL
      );
    `
  );

  await pool.query(
    `
      CREATE TABLE users_favourites (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) NOT NULL,
        recipe_id INT REFERENCES recipes(id) NOT NULL
      );
    `
  );

  /*****************/
  /* insert values */
  /*****************/

  // ingredients

  const insertIngredientsSql = format(
    `
      INSERT INTO ingredients (
        name,
        units
      )
      VALUES %L
    `,
    ingredients.map((ingredient) => {
      return [ingredient.name, ingredient.units];
    })
  );

  await pool.query(insertIngredientsSql);

  // recipes

  const insertRecipesSql = format(
    `
      INSERT INTO recipes (
        name,
        steps,
        is_vegetarian
      )
      VALUES %L;
    `,
    recipes.map((recipe) => {
      return [
        recipe.name,
        `{${recipe.steps.map((step) => `"${step}"`)}}`,
        recipe.isVegetarian,
      ];
    })
  );

  await pool.query(insertRecipesSql);

  // users

  const insertUsersSql = format(
    `
      INSERT INTO users (name)
      VALUES %L;
    `,
    users.map((user) => [user.name])
  );

  await pool.query(insertUsersSql);

  // recipes-ingredients junction

  const recipesIngredientsData = [];

  for (const recipe of recipes) {
    const recipeId = await getId(recipe.name, 'recipes');

    for (const ingredient of recipe.ingredients) {
      const ingredientId = await getId(ingredient.name, 'ingredients');

      recipesIngredientsData.push([
        recipeId,
        ingredientId,
        +ingredient.amount.replace(/\D/g, ''),
      ]);
    }
  }

  const insertRecipesIngredientsSql = format(
    `
      INSERT INTO recipes_ingredients (
        recipe_id,
        ingredient_id,
        amount
      )
      VALUES %L;
    `,
    recipesIngredientsData
  );

  await pool.query(insertRecipesIngredientsSql);

  // users-favourites junction

  const usersFavouritesData = [];

  for (const user of users) {
    const userId = await getId(user.name, 'users');

    for (const recipe of user.favouriteRecipes) {
      const recipeId = await getId(recipe, 'recipes');
      usersFavouritesData.push([userId, recipeId]);
    }
  }

  const insertUsersFavouritesSql = format(
    `
      INSERT INTO users_favourites (
        user_id,
        recipe_id
      )
      VALUES %L;
    `,
    usersFavouritesData
  );

  await pool.query(insertUsersFavouritesSql);
}

module.exports = seed;
