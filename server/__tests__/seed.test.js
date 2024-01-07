const matchers = require('jest-extended');
const pool = require('../db/pool');
const seed = require('../db/seed');
data = require('../db/data/test');

expect.extend(matchers);

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
  it('should contain 30 recipes', async () => {
    const { rows: recipes } = await pool.query('SELECT * FROM recipes;');
    expect(recipes).toHaveLength(30);
  });

  it('should return objects with correct properties', async () => {
    const { rows: recipes } = await pool.query('SELECT * FROM recipes;');

    for (const recipe of recipes) {
      expect(recipe).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        slug: expect.any(String),
        author_id: expect.any(Number),
        img_url: expect.toBeOneOf([expect.any(String), null]),
        steps: expect.any(Array),
        is_vegetarian: expect.any(Boolean),
        created_at: expect.any(Date),
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
        username: expect.any(String),
        lower_username: expect.any(String),
        hashed_password: expect.any(String),
      });
    }
  });
});

describe('recipes_ingredients junction table', () => {
  it('should contain 50 junctions (30 recipes * 5 ingredients)', async () => {
    const { rows } = await pool.query('SELECT * FROM recipes_ingredients;');
    expect(rows).toHaveLength(150);
  });

  it('should return objects with correct properties', async () => {
    const { rows } = await pool.query('SELECT * FROM recipes_ingredients;');

    for (const row of rows) {
      expect(row).toMatchObject({
        id: expect.any(Number),
        recipe_id: expect.any(Number),
        ingredient_id: expect.any(Number),
        amount: expect.any(Number),
      });
    }
  });
});

describe('favourites table', () => {
  it('should contain 8 entries', async () => {
    const { rows } = await pool.query('SELECT * FROM favourites;');
    expect(rows).toHaveLength(8);
  });

  it('should return objects with correct properties', async () => {
    const { rows } = await pool.query('SELECT * FROM favourites;');

    for (const row of rows) {
      expect(row).toMatchObject({
        id: expect.any(Number),
        recipe_id: expect.any(Number),
        user_id: expect.any(Number),
      });
    }
  });
});

describe('todo table', () => {
  it('should contain 9 entries', async () => {
    const { rows } = await pool.query('SELECT * FROM todo;');
    expect(rows).toHaveLength(9);
  });

  it('should return objects with correct properties', async () => {
    const { rows } = await pool.query('SELECT * FROM todo;');

    for (const row of rows) {
      expect(row).toMatchObject({
        id: expect.any(Number),
        recipe_id: expect.any(Number),
        user_id: expect.any(Number),
        is_done: expect.any(Boolean),
      });
    }
  });
});

describe('ratings table', () => {
  it('should contain 13 entries', async () => {
    const { rows } = await pool.query('SELECT * FROM ratings;');
    expect(rows).toHaveLength(13);
  });

  it('should return objects with correct properties', async () => {
    const { rows } = await pool.query('SELECT * FROM ratings;');

    for (const row of rows) {
      expect(row).toMatchObject({
        id: expect.any(Number),
        recipe_id: expect.any(Number),
        user_id: expect.any(Number),
        stars: expect.any(Number),
      });
    }
  });
});
