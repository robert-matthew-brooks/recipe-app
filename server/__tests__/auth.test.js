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

describe('POST /auth/register', () => {
  it('200: should return a user object with correct properties', async () => {
    const { body } = await supertest(server)
      .post('/auth/register')
      .send({ username: 'new_user', password: 'password123' })
      .expect(200);

    expect(body.user).toMatchObject({
      id: expect.any(Number),
      username: expect.any(String),
      token: expect.any(String),
    });
  });

  it('200: should create a new user in the database', async () => {
    const { body } = await supertest(server)
      .post('/auth/register')
      .send({ username: 'new_user', password: 'password123' })
      .expect(200);

    const { rows } = await pool.query(
      `
        SELECT * FROM users
        WHERE username = 'new_user';
      `
    );

    expect(rows.length).toBe(1);
  });

  describe('error handing', () => {
    it('409: should return an error if username already exists', async () => {
      await supertest(server)
        .post('/auth/register')
        .send({ username: 'user1', password: 'password1!' })
        .expect(409);
    });

    it('409: should return an error if username already exists (case insensitive)', async () => {
      await supertest(server)
        .post('/auth/register')
        .send({ username: 'USER1', password: 'password1!' })
        .expect(409);
    });

    it('400: should return an error if credentials missing', async () => {
      await supertest(server)
        .post('/auth/register')
        .send({ username: 'no_password' })
        .expect(400);

      await supertest(server)
        .post('/auth/register')
        .send({ password: 'n0-us3rnam3!' })
        .expect(400);
    });

    it('400: should return an error if strings are too short', async () => {
      await supertest(server)
        .post('/auth/register')
        .send({ username: 'x', password: 'password123' })
        .expect(400);

      await supertest(server)
        .post('/auth/register')
        .send({ username: 'new_user', password: 'x' })
        .expect(400);
    });

    it('400: should return an error if strings are too long', async () => {
      await supertest(server)
        .post('/auth/register')
        .send({
          username: 'this_is_a_very_long_username',
          password: 'password123',
        })
        .expect(400);

      await supertest(server)
        .post('/auth/register')
        .send({
          username: 'new_user',
          password: 'th1s-1s-@-v3ry-l0ng-p@ssw0rd!',
        })
        .expect(400);
    });

    it('400: should return an error if strings are invalid', async () => {
      await supertest(server)
        .post('/auth/register')
        .send({
          username: 'i*n*v*a*l*i*d',
          password: 'password123',
        })
        .expect(400);

      await supertest(server)
        .post('/auth/register')
        .send({
          username: 'new_user',
          password: 'must_have_a_number',
        })
        .expect(400);
    });
  });
});

describe('POST /auth/login', () => {
  it('200: should return a user object with correct properties', async () => {
    const { body } = await supertest(server)
      .post('/auth/login')
      .send({ username: 'user1', password: 'password1!' })
      .expect(200);

    expect(body.user).toMatchObject({
      id: expect.any(Number),
      username: expect.any(String),
      token: expect.any(String),
    });
  });

  it('404: should return an error if username not found', async () => {
    await supertest(server)
      .post('/auth/login')
      .send({ username: 'not_a_user', password: 'password1!' })
      .expect(401);
  });

  it('403: should return an error if password is incorrect', async () => {
    await supertest(server)
      .post('/auth/login')
      .send({ username: 'user1', password: 'incorrect-password1!' })
      .expect(401);
  });

  describe('error handing', () => {
    it('400: should return an error if credentials missing', async () => {
      await supertest(server)
        .post('/auth/login')
        .send({ username: 'no_password' })
        .expect(400);

      await supertest(server)
        .post('/auth/login')
        .send({ password: 'n0-us3rnam3!' })
        .expect(400);
    });

    it('400: should return an error if strings are too short', async () => {
      await supertest(server)
        .post('/auth/login')
        .send({ username: 'x', password: 'password1!' })
        .expect(400);

      await supertest(server)
        .post('/auth/login')
        .send({ username: 'user1', password: 'x' })
        .expect(400);
    });

    it('400: should return an error if strings are too long', async () => {
      await supertest(server)
        .post('/auth/login')
        .send({
          username: 'this_is_a_very_long_username',
          password: 'password1!',
        })
        .expect(400);

      await supertest(server)
        .post('/auth/login')
        .send({
          username: 'user1',
          password: 'th1s-1s-@-v3ry-l0ng-p@ssw0rd!',
        })
        .expect(400);
    });

    it('400: should return an error if strings are invalid', async () => {
      await supertest(server)
        .post('/auth/login')
        .send({
          username: 'i*n*v*a*l*i*d',
          password: 'password1!',
        })
        .expect(400);

      await supertest(server)
        .post('/auth/login')
        .send({
          username: 'user1',
          password: 'must_have_a_number',
        })
        .expect(400);
    });
  });
});
