const pool = require('../db/pool');
const { verifyToken } = require('../util/token');

async function getAll() {
  const { rows } = await pool.query(
    `
      SELECT * FROM ingredients
      ORDER BY name ASC;
    `
  );

  return { ingredients: rows };
}

async function getShoppingList(token) {
  const userId = verifyToken(token).id;

  const { rows } = await pool.query(
    `
      SELECT
        i.name,
        ri.amount,
        i.units
      FROM (
        SELECT r.id from recipes r
        INNER JOIN todos t
        ON r.id = t.recipe_id
        WHERE t.user_id = ${userId}
      ) r
      INNER JOIN recipes_ingredients ri
      ON r.id = ri.recipe_id
      INNER JOIN ingredients i
      ON i.id = ri.ingredient_id
      ORDER BY i.name ASC;
    `
  );

  return { ingredients: rows };
}

module.exports = { getAll, getShoppingList };
