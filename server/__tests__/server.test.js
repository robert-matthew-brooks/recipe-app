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

describe('ALL endpoint not found', () => {
  it('404 should return an error', async () => {
    await supertest(server).get('/not-an-endpoint').expect(404);
  });
});

describe('GET /health', () => {
  it('200: should confirm server is up', async () => {
    await supertest(server).get('/health').expect(200);
  });
});

describe('GET /recipes/:recipe_id', () => {
  it('200: should return an object with correct properties', async () => {
    const { body } = await supertest(server).get('/recipes/1').expect(200);

    expect(body.recipe).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      ingredients: expect.any(Array),
      steps: expect.any(Array),
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
});
