const supertest = require('supertest');
const pool = require('../db/pool');
const seed = require('../db/seed');
data = require('../db/data/test');

let client;

beforeAll(async () => {
  client = await pool.connect();
});

beforeEach(async () => {
  await seed(client, data);
});

afterAll(async () => {
  await client.release();
  await pool.end();
});

describe('ingredients table', () => {
  it('should contain 10 ingredients', async () => {
    const { rows } = await client.query('SELECT * FROM ingredients;');
    expect(rows.length).toBe(10);
  });

  it('should return objects with correct properties', async () => {
    const { rows } = await client.query('SELECT * FROM ingredients;');

    for (const ingredient of rows) {
      expect(ingredient).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        unit: expect.any(String),
      });
    }
  });
});
