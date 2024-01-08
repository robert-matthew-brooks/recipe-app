const pool = require('./pool');
const format = require('pg-format');
const { hash } = require('../util/encrypt');

async function seed({ recipes, users }) {
  /******************/
  /* util functions */
  /******************/

  const getId = async (value, field, table) => {
    const { rows } = await pool.query(
      format(
        `
          SELECT id FROM %s
          WHERE LOWER(%s) = LOWER(%L);
        `,
        table,
        field,
        value
      )
    );

    return rows[0].id;
  };

  const arrToSqlArr = (arr) => {
    return `{${arr.map((el) => `"${el}"`)}}`;
  };

  /***************/
  /* drop tables */
  /***************/

  await pool.query('DROP TABLE IF EXISTS ratings CASCADE;');
  await pool.query('DROP TABLE IF EXISTS todos CASCADE;');
  await pool.query('DROP TABLE IF EXISTS favourites CASCADE;');
  await pool.query('DROP TABLE IF EXISTS recipes_ingredients CASCADE;');
  await pool.query('DROP TABLE IF EXISTS recipes CASCADE;');
  await pool.query('DROP TABLE IF EXISTS ingredients CASCADE;');
  await pool.query('DROP TABLE IF EXISTS users CASCADE;');

  /*****************/
  /* create tables */
  /*****************/

  // "lower_username" is for keeping it unique -
  // "username" preserves case
  await pool.query(
    `
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL,
        lower_username VARCHAR UNIQUE NOT NULL,
        hashed_password VARCHAR NOT NULL
      );
    `
  );

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
        name VARCHAR NOT NULL,
        slug VARCHAR UNIQUE NOT NULL,
        img_url VARCHAR,
        author_id INT REFERENCES users NOT NULL,
        steps VARCHAR[],
        is_vegetarian BOOLEAN,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `
  );

  // junction tables

  await pool.query(
    `
      CREATE TABLE recipes_ingredients (
        id SERIAL PRIMARY KEY,
        recipe_id INT REFERENCES recipes NOT NULL,
        ingredient_id INT REFERENCES ingredients NOT NULL,
        amount INT NOT NULL
      );
    `
  );

  await pool.query(
    `
      CREATE TABLE favourites (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users NOT NULL,
        recipe_id INT REFERENCES recipes NOT NULL
      );
    `
  );

  await pool.query(
    `
      CREATE TABLE todos (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users NOT NULL,
        recipe_id INT REFERENCES recipes NOT NULL,
        is_done BOOLEAN DEFAULT FALSE
      );
    `
  );

  await pool.query(
    `
      CREATE TABLE ratings (
        id SERIAL PRIMARY KEY,
        recipe_id INT REFERENCES recipes NOT NULL,
        user_id INT REFERENCES users NOT NULL,
        stars INT
      );
    `
  );

  /*****************/
  /* insert values */
  /*****************/

  const insertUsersSql = format(
    `
      INSERT INTO users (
        username,
        lower_username,
        hashed_password
      )
      VALUES %L;
    `,
    users.map((user) => {
      return [user.username, user.username.toLowerCase(), hash(user.password)];
    })
  );

  await pool.query(insertUsersSql);

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
  // nb. mapping individual queries vs bulk insert gives a few ms delay
  // allowing testing of sorting by timestamp

  const insertRecipesSqlArr = await Promise.all(
    recipes.map(async (recipe) => {
      return format(
        `
          INSERT INTO recipes (
            name,
            slug,
            author_id,
            img_url,
            steps,
            is_vegetarian
          )
          VALUES (%L);
        `,
        await Promise.all([
          recipe.name,
          recipe.slug,
          await getId(recipe.author, 'username', 'users'),
          recipe.imgUrl,
          arrToSqlArr(recipe.steps),
          recipe.isVegetarian,
        ])
      );
    })
  );

  await Promise.all(
    insertRecipesSqlArr.map((str) => {
      return pool.query(str);
    })
  );

  // recipes-ingredients junction

  const recipesIngredientsData = [];

  for (const recipe of recipes) {
    const recipeId = await getId(recipe.slug, 'slug', 'recipes');

    for (const ingredient of recipe.ingredients) {
      const ingredientId = await getId(ingredient.name, 'name', 'ingredients');

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

  // get user junction data

  const recipeFavouritesData = [];
  const recipeTodosData = [];
  const recipeRatingsData = [];

  for (const user of users) {
    const userId = await getId(user.username, 'username', 'users');

    for (const recipeSlug of user.favourites) {
      const recipeId = await getId(recipeSlug, 'slug', 'recipes');

      recipeFavouritesData.push([recipeId, userId]);
    }

    for (const recipeSlug of user.todos) {
      const recipeId = await getId(recipeSlug, 'slug', 'recipes');
      const isDone = user.done.includes(recipeSlug);

      recipeTodosData.push([recipeId, userId, isDone]);
    }

    for (const rating of user.ratings) {
      const recipeId = await getId(rating.slug, 'slug', 'recipes');

      recipeRatingsData.push([recipeId, userId, rating.stars]);
    }
  }

  // users-recipes favourites junction

  const insertRecipeFavouritesSql = format(
    `
      INSERT INTO favourites (
        recipe_id,
        user_id
      )
      VALUES %L;
    `,
    recipeFavouritesData
  );

  await pool.query(insertRecipeFavouritesSql);

  // users-recipes todos junction

  const insertRecipeTodosSql = format(
    `
      INSERT INTO todos (
        recipe_id,
        user_id,
        is_done
      )
      VALUES %L;
    `,
    recipeTodosData
  );

  await pool.query(insertRecipeTodosSql);

  // recipes-users ratings junction

  const insertRecipeRatingsSql = format(
    `
      INSERT INTO ratings (
        recipe_id,
        user_id,
        stars
      )
      VALUES %L;
    `,
    recipeRatingsData
  );

  await pool.query(insertRecipeRatingsSql);
}

module.exports = seed;
