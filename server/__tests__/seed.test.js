const pool = require('../db/pool');
const seed = require('../db/seed');
data = require('../db/data/test');

beforeEach(async () => {
  await seed(data);
});

afterAll(async () => {
  await pool.end();
});

describe('ingredients table', () => {
  it('should contain 10 ingredients', async () => {
    const { rows: ingredients } = await pool.query(
      'SELECT * FROM ingredients;'
    );
    expect(ingredients).toHaveLength(10);
  });

  it('should return objects with correct properties', async () => {
    const { rows: ingredients } = await pool.query(
      'SELECT * FROM ingredients;'
    );

    for (const ingredient of ingredients) {
      expect(ingredient).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        units: expect.any(String),
      });
    }
  });
});

describe('recipes table', () => {
  it('should contain 10 recipes', async () => {
    const { rows: recipes } = await pool.query('SELECT * FROM recipes;');
    expect(recipes).toHaveLength(10);
  });

  it('should return objects with correct properties', async () => {
    const { rows: recipes } = await pool.query('SELECT * FROM recipes;');

    for (const recipe of recipes) {
      expect(recipe).toMatchObject({
        id: expect.any(Number),
        steps: expect.any(Array),
        is_vegetarian: expect.any(Boolean),
      });
    }
  });
});

describe('recipes_ingredients junction table', () => {
  it('should contain 50 junctions (10 recipes * 5 ingredients)', async () => {
    const { rows } = await pool.query('SELECT * FROM recipes_ingredients;');
    expect(rows).toHaveLength(50);
  });

  it('should return objects with correct properties', async () => {
    const { rows: recipes } = await pool.query(
      'SELECT * FROM recipes_ingredients;'
    );

    for (const recipe of recipes) {
      expect(recipe).toMatchObject({
        id: expect.any(Number),
        recipe_id: expect.any(Number),
        ingredient_id: expect.any(Number),
        amount: expect.any(Number),
      });
    }
  });
});

describe('users table', () => {
  it('should contain 5 users', async () => {
    const { rows } = await pool.query('SELECT * FROM users;');
    expect(rows).toHaveLength(5);
  });

  it('should return objects with correct properties', async () => {
    const { rows: users } = await pool.query('SELECT * FROM users;');

    for (const user of users) {
      expect(user).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
      });
    }
  });
});
