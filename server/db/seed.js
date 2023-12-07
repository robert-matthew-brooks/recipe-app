const format = require('pg-format');

async function seed(client, data) {
  const { ingredients, recipes } = data;

  /***************/
  /* drop tables */
  /***************/

  await client.query('DROP TABLE IF EXISTS ingredients;');

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

  /*****************/
  /* insert values */
  /*****************/

  const insertIngredientsQueryStr = format(
    `INSERT INTO ingredients (
      name,
      unit
    )
    VALUES %L`,
    ingredients.map((ingredient) => {
      return [ingredient.name, ingredient.unit];
    })
  );

  await client.query(insertIngredientsQueryStr);
}

module.exports = seed;
