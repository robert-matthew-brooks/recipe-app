const pool = require('./pool');
const format = require('pg-format');

async function seed(data) {
  const { ingredients, recipes } = data;

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

  await pool.query('DROP TABLE IF EXISTS recipes_ingredients CASCADE;');
  await pool.query('DROP TABLE IF EXISTS ingredients CASCADE;');
  await pool.query('DROP TABLE IF EXISTS recipes CASCADE;');

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
        steps VARCHAR[]
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
        steps
      )
      VALUES %L;
    `,
    recipes.map((recipe) => {
      return [recipe.name, `{${recipe.steps.map((el) => `"${el}"`)}}`];
    })
  );

  await pool.query(insertRecipesSql);

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
}

module.exports = seed;
