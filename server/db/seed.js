const pool = require('./pool');
const format = require('pg-format');

async function seed({ recipes, users }) {
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

  const getIdList = async (names, table) => {
    return await Promise.all(
      names.map(async (name) => {
        return await getId(name, table);
      })
    );
  };

  const arrToSqlArr = (arr) => {
    return `{${arr.map((el) => `"${el}"`)}}`;
  };

  /***************/
  /* drop tables */
  /***************/

  await pool.query('DROP TABLE IF EXISTS recipe_likes CASCADE;');
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
        name VARCHAR UNIQUE NOT NULL,
        password VARCHAR NOT NULL,
        favourites INT[],
        list INT[]
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
      CREATE TABLE recipe_likes (
        id SERIAL PRIMARY KEY,
        recipe_id INT REFERENCES recipes(id) NOT NULL,
        user_id INT REFERENCES users(id) NOT NULL,
        is_liked BOOLEAN NOT NULL
      );
    `
  );

  /*****************/
  /* insert values */
  /*****************/

  // ingredients

  const ingredientsData = [];

  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      const isDuplicate = ingredientsData.some(
        (el) => el.name === ingredient.name
      );

      if (!isDuplicate) {
        ingredientsData.push({
          name: ingredient.name,
          units: ingredient.amount.replace(/[\d.]/g, ''),
        });
      }
    }
  }

  const insertIngredientsSql = format(
    `
      INSERT INTO ingredients (
        name,
        units
      )
      VALUES %L
    `,
    ingredientsData.map((ingredient) => {
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
      return [recipe.name, arrToSqlArr(recipe.steps), recipe.isVegetarian];
    })
  );

  await pool.query(insertRecipesSql);

  // users

  const insertUsersSql = format(
    `
      INSERT INTO users (
        name,
        password,
        favourites,
        list
      )
      VALUES %L;
    `,
    await Promise.all(
      users.map(async (user) => {
        return [
          user.name,
          user.password,
          arrToSqlArr(await getIdList(user.favourites, 'recipes')),
          arrToSqlArr(await getIdList(user.list, 'recipes')),
        ];
      })
    )
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

  // recipes-users likes junction

  const recipeLikesData = [];

  for (const user of users) {
    const userId = await getId(user.name, 'users');

    for (const recipeName of user.likes) {
      const recipeId = await getId(recipeName, 'recipes');

      recipeLikesData.push([
        recipeId,
        userId,
        true, // isLiked, always true for seeding
      ]);
    }
  }

  const insertRecipeLikesSql = format(
    `
      INSERT INTO recipe_likes (
        recipe_id,
        user_id,
        is_liked
      )
      VALUES %L;
    `,
    recipeLikesData
  );

  await pool.query(insertRecipeLikesSql);
}

module.exports = seed;
