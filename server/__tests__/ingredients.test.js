const supertest = require('supertest');
const server = require('../server');
const pool = require('../db/pool');
const seed = require('../db/seed');
const data = require('../db/data/test');
const { createToken } = require('../util/token');

let token;

beforeEach(async () => {
  await seed(data);

  token = createToken(
    (await pool.query('SELECT id, username FROM users;')).rows[0]
  );
});

afterAll(async () => {
  await pool.end();
});

describe('GET /ingredients', () => {
  it('200 should return an array of ingredient objects with the correct properties', async () => {
    const { body } = await supertest(server).get('/ingredients').expect(200);

    for (const ingredient of body.ingredients) {
      expect(ingredient).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        units: expect.any(String),
      });
    }
  });

  it('200 should return 10 ingredients', async () => {
    const { body } = await supertest(server).get('/ingredients').expect(200);
    expect(body.ingredients).toHaveLength(10);
  });
});

describe('GET /ingredients/shopping-list', () => {
  it('200 should return an array of ingredient objects with the correct properties ', async () => {
    const { body } = await supertest(server)
      .get('/ingredients/shopping-list')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    for (const ingredient of body.ingredients) {
      expect(ingredient).toMatchObject({
        name: expect.any(String),
        amount: expect.any(Number),
        units: expect.any(String),
      });
    }
  });

  it('200: should return 15 ingredients from the todo recipes', async () => {
    const { body } = await supertest(server)
      .get('/ingredients/shopping-list')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.ingredients).toHaveLength(15);
  });

  describe('error handling', () => {
    it('401: should return an error if user token not provided', async () => {
      await supertest(server).get('/ingredients/shopping-list').expect(401);
    });
  });
});
