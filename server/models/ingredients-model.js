const pool = require('../db/pool');

async function getIngredients() {
  const { rows } = await pool.query(
    `
      SELECT * FROM ingredients
      ORDER BY name ASC;
    `
  );

  return { ingredients: rows };
}

module.exports = { getIngredients };
