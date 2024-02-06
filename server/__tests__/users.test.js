const supertest = require('supertest');
const server = require('../server');
const pool = require('../db/pool');
const seed = require('../db/seed');
const data = require('../db/data/test');
const { createToken } = require('../util/token');

let username;
let token;

beforeEach(async () => {
  await seed(data);

  const user = (await pool.query('SELECT id, username FROM users;')).rows[0];

  username = user.username;
  token = createToken(user);
});

afterAll(async () => {
  await pool.end();
});

describe('GET /users/availability/:username', () => {
  it('200: should return a user object with correct properties', async () => {
    const { body } = await supertest(server)
      .get(`/users/availability/${username}`)
      .expect(200);

    expect(body.user).toMatchObject({
      username: expect.any(String),
      is_available: expect.any(Boolean),
    });
  });

  it('200: should reflect if the username is not available', async () => {
    const { body } = await supertest(server)
      .get(`/users/availability/${username}`)
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

describe('GET /users/recipes', () => {
  it('200: should return recipes by test user with correct object properties', async () => {
    const { body } = await supertest(server)
      .get(`/users/recipes`)
      .set('Authorization', `Bearer: ${token}`)
      .expect(200);

    for (const recipe of body.recipes) {
      expect(recipe).toMatchObject({
        slug: expect.any(String),
        name: expect.any(String),
      });
    }
  });

  it('200: should return 6 recipes by test user', async () => {
    const { body } = await supertest(server)
      .get(`/users/recipes`)
      .set('Authorization', `Bearer: ${token}`)
      .expect(200);

    expect(body.recipes).toHaveLength(6);
  });
});

describe('PATCH /users', () => {
  it('200: should return a new user object with correct properties', async () => {
    const { body } = await supertest(server)
      .patch('/users')
      .set('Authorization', `Bearer: ${token}`)
      .send({ username: 'new_user', password: 'password123' })
      .expect(200);

    expect(body.user).toMatchObject({
      id: expect.any(Number),
      username: expect.any(String),
      token: expect.any(String),
    });
  });

  describe('error handing', () => {
    it('409: should return an error if username already exists', async () => {
      const { username } = data.users[1];

      await supertest(server)
        .patch('/users')
        .set('Authorization', `Bearer: ${token}`)
        .send({ username, password: 'password1!' })
        .expect(409);
    });

    it('409: should return an error if username already exists (case insensitive)', async () => {
      const { username } = data.users[1];

      await supertest(server)
        .patch('/users')
        .set('Authorization', `Bearer: ${token}`)
        .send({ username: username.toUpperCase(), password: 'password1!' })
        .expect(409);
    });

    it('400: should return an error if credentials missing', async () => {
      await supertest(server)
        .patch('/users')
        .set('Authorization', `Bearer: ${token}`)
        .send({ username: 'no_password' })
        .expect(400);

      await supertest(server)
        .patch('/users')
        .set('Authorization', `Bearer: ${token}`)
        .send({ password: 'n0-us3rnam3!' })
        .expect(400);
    });

    it('400: should return an error if strings are too short', async () => {
      await supertest(server)
        .patch('/users')
        .set('Authorization', `Bearer: ${token}`)
        .send({ username: 'x', password: 'password123' })
        .expect(400);

      await supertest(server)
        .patch('/users')
        .set('Authorization', `Bearer: ${token}`)
        .send({ username: 'new_user', password: 'x' })
        .expect(400);
    });

    it('400: should return an error if strings are too long', async () => {
      await supertest(server)
        .patch('/users')
        .set('Authorization', `Bearer: ${token}`)
        .send({
          username: 'this_is_a_very_long_username',
          password: 'password123',
        })
        .expect(400);

      await supertest(server)
        .patch('/users')
        .set('Authorization', `Bearer: ${token}`)
        .send({
          username: 'new_user',
          password: 'th1s-1s-@-v3ry-l0ng-p@ssw0rd!',
        })
        .expect(400);
    });

    it('400: should return an error if strings are invalid', async () => {
      await supertest(server)
        .patch('/users')
        .set('Authorization', `Bearer: ${token}`)
        .send({
          username: 'i*n*v*a*l*i*d',
          password: 'password123',
        })
        .expect(400);

      await supertest(server)
        .patch('/users')
        .set('Authorization', `Bearer: ${token}`)
        .send({
          username: 'new_user',
          password: 'must_have_a_number',
        })
        .expect(400);
    });
  });
});
