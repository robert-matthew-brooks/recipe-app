const supertest = require('supertest');
const matchers = require('jest-extended');
const server = require('../server');
const pool = require('../db/pool');
const seed = require('../db/seed');
const data = require('../db/data/test');
const { createToken } = require('../util/token');

expect.extend(matchers);

beforeEach(async () => {
  await seed(data);
});

afterAll(async () => {
  await pool.end();
});

describe('GET /recipes/:recipe_id', () => {
  it('200: should return a recipe object with correct properties', async () => {
    const { body } = await supertest(server)
      .get('/recipes/recipe-1')
      .expect(200);

    expect(body.recipe).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      slug: expect.any(String),
      author: expect.any(String),
      img_url: expect.toBeOneOf([expect.any(String), null]),
      ingredients: expect.any(Array),
      steps: expect.any(Array),
      is_vegetarian: expect.any(Boolean),
      created_at: expect.any(String),
      likes: expect.any(Number),
    });

    for (const ingredient of body.recipe.ingredients) {
      expect(ingredient).toMatchObject({
        name: expect.any(String),
        amount: expect.any(Number),
        units: expect.any(String),
      });
    }

    for (const step of body.recipe.steps) {
      expect(typeof step).toBe('string');
    }
  });

  describe('error handling', () => {
    it('404: should return an error if recipe_id is not in database', async () => {
      await supertest(server).get('/recipes/recipe-999').expect(404);
    });
  });
});

describe('GET /recipes', () => {
  it('200: should return an array of recipe objects with the correct properties', async () => {
    const { body } = await supertest(server).post('/recipes').expect(200);

    expect(body).toMatchObject({
      recipes: expect.any(Object),
      total_recipes: expect.any(Number),
    });

    for (const recipe of body.recipes) {
      expect(recipe).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        slug: expect.any(String),
        author: expect.any(String),
        img_url: expect.toBeOneOf([expect.any(String), null]),
        created_at: expect.any(String),
        likes: expect.any(Number),
      });
    }
  });

  it('200: should return 10 recipes from 30 total ', async () => {
    const { body } = await supertest(server).post('/recipes').expect(200);
    expect(body.recipes).toHaveLength(10);
    expect(body.total_recipes).toBe(30);
  });

  it('200: should filter 5 tagged recipe names', async () => {
    const { body } = await supertest(server)
      .post('/recipes')
      .send({ search_term: 'tag' })
      .expect(200);

    expect(body.recipes).toHaveLength(5);
    expect(body.total_recipes).toBe(5);
  });

  it('200: should allow URI encoded strings with % symbol', async () => {
    await supertest(server)
      .post('/recipes')
      .send({ search_term: 'string%20with%20spaces' })
      .expect(200);

    const encodedSearchTerm = encodeURI('string with spaces');

    await supertest(server)
      .post('/recipes')
      .send({ search_term: encodedSearchTerm })
      .expect(200);
  });

  it('200: should filter 21 recipes with specific ingredients', async () => {
    const ingredientIds = [1, 3];

    const { body } = await supertest(server)
      .post('/recipes')
      .send({ ingredient_ids: ingredientIds, limit: 999 })
      .expect(200);

    expect(body.recipes).toHaveLength(21);
    expect(body.total_recipes).toBe(21);
  });

  it('200: should filter 2 favourite recipes', async () => {
    const token = createToken(
      (await pool.query('SELECT id, username FROM users;')).rows[0]
    );

    const { body } = await supertest(server)
      .post('/recipes')
      .send({ favourites_token: token })
      .expect(200);

    expect(body.recipes).toHaveLength(2);
    expect(body.total_recipes).toBe(2);
  });

  it('200: should filter 9 vegetarian recipes', async () => {
    const { body } = await supertest(server)
      .post('/recipes')
      .send({ is_vegetarian: true })
      .expect(200);

    expect(body.recipes).toHaveLength(9);
    expect(body.total_recipes).toBe(9);
  });

  describe('sorting', () => {
    it('200: should order recipes by date', async () => {
      const { body } = await supertest(server)
        .post('/recipes')
        .send({ sort: 'new' })
        .expect(200);

      const timestamps = body.recipes.map((recipe) => recipe.created_at);

      expect(timestamps).toEqual(
        [...timestamps].sort((a, b) => {
          return Date.parse(a) < Date.parse(b) ? 1 : -1;
        })
      );
    });

    it('200: should order recipes by number of likes', async () => {
      const { body } = await supertest(server)
        .post('/recipes')
        .send({ sort: 'top' })
        .expect(200);

      const likes = body.recipes.map((recipe) => recipe.likes);

      expect(likes).toEqual(
        [...likes].sort((a, b) => {
          return a < b ? 1 : -1;
        })
      );
    });

    it('200: should order recipes by name', async () => {
      const { body } = await supertest(server)
        .post('/recipes')
        .send({ sort: 'az' })
        .expect(200);

      const names = body.recipes.map((recipe) => recipe.name);

      expect(names).toEqual([...names].sort());
    });

    it('200: should order recipes by name in reverse order', async () => {
      const { body } = await supertest(server)
        .post('/recipes')
        .send({ sort: 'za' })
        .expect(200);

      const names = body.recipes.map((recipe) => recipe.name);

      expect(names).toEqual([...names].sort().reverse());
    });
  });

  describe('pagination', () => {
    it('200: should return specified number of recipes', async () => {
      const { body } = await supertest(server)
        .post('/recipes')
        .send({ limit: 6 })
        .expect(200);
      expect(body.recipes).toHaveLength(6);
    });

    it('200: should return different recipes for different specified pages', async () => {
      const { body: body1 } = await supertest(server)
        .post('/recipes')
        .send({ page: 1 })
        .expect(200);

      const { body: body2 } = await supertest(server)
        .post('/recipes')
        .send({ page: 2 })
        .expect(200);

      const recipeIds1 = body1.recipes.map((recipe) => recipe.id);
      const recipeIds2 = body2.recipes.map((recipe) => recipe.id);

      recipeIds1.forEach((recipeId) => {
        expect(recipeIds2).not.toContain(recipeId);
      });
    });
  });

  describe('error handling', () => {
    it('400: should return an error if tag is not valid', async () => {
      await supertest(server)
        .post('/recipes')
        .send({ search_term: 'i*n*v*a*l*i*d' })
        .expect(400);
    });

    it('400: should return an error if ingredient id values not valid', async () => {
      const ingredientIds = [1, 2, 3, 'invalid'];

      await supertest(server)
        .post('/recipes')
        .send({ ingredient_ids: ingredientIds })
        .expect(400);
    });

    it('403: should return an error if token for favourites is not valid', async () => {
      await supertest(server)
        .post('/recipes')
        .send({ favourites_token: 'invalid' })
        .expect(403);
    });

    it('400: should return an error if sort option is not in whitelist', async () => {
      await supertest(server)
        .post('/recipes')
        .send({ sort: 'not_in_whitelist' })
        .expect(400);
    });

    it('400: should return an error if limit is not a number', async () => {
      await supertest(server)
        .post('/recipes')
        .send({ limit: 'NaN' })
        .expect(400);
    });

    it('400: should return an error if page is not a number', async () => {
      await supertest(server)
        .post('/recipes')
        .send({ page: 'NaN' })
        .expect(400);
    });
  });
});
