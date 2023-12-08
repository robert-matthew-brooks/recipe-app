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
    const { rows } = await pool.query('SELECT * FROM ingredients;');
    expect(rows.length).toBe(10);
  });

  it('should return objects with correct properties', async () => {
    const { rows } = await pool.query('SELECT * FROM ingredients;');

    for (const ingredient of rows) {
      expect(ingredient).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        units: expect.any(String),
      });
    }
  });
});

describe('recipes table', () => {
  it('should contain 3 recipes', async () => {
    const { rows } = await pool.query('SELECT * FROM recipes;');
    expect(rows.length).toBe(3);
  });

  it('should return objects with correct properties', async () => {
    const { rows } = await pool.query('SELECT * FROM recipes;');

    for (const recipe of rows) {
      expect(recipe).toMatchObject({
        id: expect.any(Number),
        steps: expect.any(Array),
      });
    }
  });
});

describe('recipes table', () => {
  it('should contain 3 recipes', async () => {
    const { rows } = await pool.query('SELECT * FROM recipes;');
    expect(rows.length).toBe(3);
  });

  it('should return objects with correct properties', async () => {
    const { rows } = await pool.query('SELECT * FROM recipes;');

    for (const recipe of rows) {
      expect(recipe).toMatchObject({
        id: expect.any(Number),
        steps: expect.any(Array),
      });
    }
  });
});

describe('recipes_ingredients junction table', () => {
  it('should contain 15 junctions (3 recipes * 5 ingredients)', async () => {
    const { rows } = await pool.query('SELECT * FROM recipes_ingredients;');
    expect(rows.length).toBe(15);
  });

  it('should return objects with correct properties', async () => {
    const { rows } = await pool.query('SELECT * FROM recipes_ingredients;');

    for (const recipe of rows) {
      expect(recipe).toMatchObject({
        id: expect.any(Number),
        recipe_id: expect.any(Number),
        ingredient_id: expect.any(Number),
        amount: expect.any(Number),
      });
    }
  });
});
