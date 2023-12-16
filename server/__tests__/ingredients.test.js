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

describe('GET /ingredients', () => {
  it('should return an array of ingredient objects with the correct properties', async () => {
    const { body } = await supertest(server).get('/ingredients').expect(200);

    for (const ingredient of body.ingredients) {
      expect(ingredient).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        units: expect.any(String),
      });
    }
  });

  it('should return 10 ingredients', async () => {
    const { body } = await supertest(server).get('/ingredients').expect(200);
    expect(body.ingredients).toHaveLength(10);
  });
});
