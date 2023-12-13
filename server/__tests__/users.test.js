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

describe('GET /users/availability/:username', () => {
  it('200: should return a user object with correct properties', async () => {
    const { body } = await supertest(server)
      .get('/users/availability/user1')
      .expect(200);

    expect(body.user).toMatchObject({
      username: expect.any(String),
      is_available: expect.any(Boolean),
    });
  });

  it('200: should reflect if the username is not available', async () => {
    const { body } = await supertest(server)
      .get('/users/availability/user1')
      .expect(200);

    expect(body.user.is_available).toBe(false);
  });

  it('200: should reflect if the username is available', async () => {
    const { body } = await supertest(server)
      .get('/users/availability/user999')
      .expect(200);

    expect(body.user.is_available).toBe(true);
  });

  it('200: should be case insensitive', async () => {
    const { body } = await supertest(server)
      .get('/users/availability/UsEr1')
      .expect(200);

    expect(body.user.is_available).toBe(false);
  });
});
