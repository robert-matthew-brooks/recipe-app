const format = require('pg-format');

async function seed(client, data) {
  const { ingredients, recipes } = data;

  /******************/
  /* util functions */
  /******************/

  const getId = async (name, table) => {
    const { rows } = await client.query(
      `
        SELECT id FROM ${table}
        WHERE name = $1;
      `,
      [name]
    );

    return rows[0].id;
  };

  /***************/
  /* drop tables */
  /***************/

  await client.query('DROP TABLE IF EXISTS recipes_ingredients;');
  await client.query('DROP TABLE IF EXISTS ingredients;');
  await client.query('DROP TABLE IF EXISTS recipes;');

  /*****************/
  /* create tables */
  /*****************/

  await client.query(`
    CREATE TABLE ingredients (
      id SERIAL PRIMARY KEY,
      name VARCHAR UNIQUE NOT NULL,
      unit VARCHAR
    );
  `);

  await client.query(
    `
      CREATE TABLE recipes (
        id SERIAL PRIMARY KEY,
        name VARCHAR UNIQUE NOT NULL,
        instructions VARCHAR[]
      );
    `
  );

  // junction tables

  await client.query(
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
        unit
      )
      VALUES %L
    `,
    ingredients.map((ingredient) => {
      return [ingredient.name, ingredient.unit];
    })
  );

  await client.query(insertIngredientsSql);

  // recipes

  const insertRecipesSql = format(
    `
      INSERT INTO recipes (
        name,
        instructions
      )
      VALUES %L
    `,
    recipes.map((recipe) => {
      return [recipe.name, `{${recipe.instructions.map((el) => `"${el}"`)}}`];
    })
  );

  await client.query(insertRecipesSql);

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
      VALUES %L
    `,
    recipesIngredientsData
  );

  await client.query(insertRecipesIngredientsSql);
}

module.exports = seed;
