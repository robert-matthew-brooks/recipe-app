const supertest = require('supertest');
const server = require('../server');
const pool = require('../db/pool');
const seed = require('../db/seed');
const data = require('../db/data/test');

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
      ingredients: expect.any(Array),
      steps: expect.any(Array),
      is_vegetarian: expect.any(Boolean),
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
  it('should return 10 recipe objects', async () => {
    const { body } = await supertest(server).get('/recipes').expect(200);
    expect(body.recipes).toHaveLength(10);
  });

  it('should return an array of recipe objects with the correct properties', async () => {
    const { body } = await supertest(server).get('/recipes').expect(200);

    for (const recipe of body.recipes) {
      expect(recipe).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        slug: expect.any(String),
        likes: expect.any(Number),
      });
    }
  });

  it('should filter 5 tagged recipe names', async () => {
    const { body } = await supertest(server)
      .get('/recipes?search_term=tag')
      .expect(200);

    expect(body.recipes).toHaveLength(5);
  });

  it('should allow URI encoded strings with % symbol', async () => {
    await supertest(server)
      .get('/recipes?search_term=string%20with%20spaces')
      .expect(200);

    const encodedSearchTerm = encodeURI('string with spaces');

    await supertest(server)
      .get(`/recipes?search_term=${encodedSearchTerm}`)
      .expect(200);
  });

  it('should filter 7 recipes with specific ingredients', async () => {
    const ingredientIdsStr = JSON.stringify([1, 3]);

    const { body } = await supertest(server)
      .get(`/recipes?ingredient_ids=${ingredientIdsStr}`)
      .expect(200);

    expect(body.recipes).toHaveLength(7);
  });

  it('should filter 3 vegetarian recipes', async () => {
    const { body } = await supertest(server)
      .get('/recipes?is_vegetarian=true')
      .expect(200);

    expect(body.recipes).toHaveLength(3);
  });

  it('should filter 3 vegetarian recipes for any provided value', async () => {
    const { body } = await supertest(server)
      .get('/recipes?is_vegetarian=some-other-value-!*$')
      .expect(200);

    expect(body.recipes).toHaveLength(3);
  });

  describe('error handling', () => {
    it('400: should return an error if tag is not valid', async () => {
      await supertest(server)
        .get('/recipes?search_term=i*n*v*a*l*i*d')
        .expect(400);
    });

    it('400: should return an error if ingredient id values not valid', async () => {
      const ingredientIdsStr = JSON.stringify([1, 2, 3, 'invalid']);

      await supertest(server)
        .get(`/recipes?ingredient_ids=${ingredientIdsStr}`)
        .expect(400);
    });
  });
});