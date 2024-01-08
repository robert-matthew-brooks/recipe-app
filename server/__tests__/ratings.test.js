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

afterAll(() => {
  pool.end();
});

describe('GET /ratings/:recipe_slug', () => {
  it('200: should return a rating number', async () => {
    const { body } = await supertest(server)
      .get('/ratings/recipe-1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.rating).toEqual(expect.any(Number));
  });

  it('200: should return null if no rating exists', async () => {
    const { body } = await supertest(server)
      .get('/ratings/recipe-4')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.rating).toBeUndefined();
  });

  describe('error handling', () => {
    it('401: should return an error if user token not provided', async () => {
      await supertest(server).get('/ratings/recipe-1').expect(401);
    });

    it('404: should return an error if recipe_id is not in database', async () => {
      await supertest(server)
        .get('/ratings/recipe-999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});

describe('PUT /ratings/:recipe_slug', () => {
  it('200: should add an entry if no rating exists', async () => {
    await supertest(server)
      .put('/ratings/recipe-4')
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 5 })
      .expect(204);

    const { body } = await supertest(server)
      .get('/ratings/recipe-4')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.rating).toBe(5);
  });

  it('200: should overwrite a rating if one exists', async () => {
    await supertest(server)
      .put('/ratings/recipe-1')
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 1 })
      .expect(204);

    const { body } = await supertest(server)
      .get('/ratings/recipe-1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.rating).toBe(1);
  });

  describe('error handling', () => {
    it('401: should return an error if user token not provided', async () => {
      await supertest(server)
        .put('/ratings/recipe-1')
        .send({ rating: 5 })
        .expect(401);
    });

    it('404: should return an error if recipe_id is not in database', async () => {
      await supertest(server)
        .put('/ratings/recipe-999')
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 5 })
        .expect(404);
    });

    it('400: should return an error if rating is not a number', async () => {
      await supertest(server)
        .put('/ratings/recipe-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 'not_a_number' })
        .expect(400);
    });

    it('400: should return an error if rating is not 1-5', async () => {
      await supertest(server)
        .put('/ratings/recipe-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 6 })
        .expect(400);
    });
  });
});

describe('DELETE /ratings/:recipe_slug', () => {
  it('200: should remove an existing rating', async () => {
    await supertest(server)
      .delete('/ratings/recipe-1')
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const { body } = await supertest(server)
      .get('/ratings/recipe-1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.rating).toBeUndefined();
  });

  describe('error handling', () => {
    it('401: should return an error if user token not provided', async () => {
      await supertest(server).delete('/ratings/recipe-1').expect(401);
    });

    it('404: should return an error if recipe_id is not in database', async () => {
      await supertest(server)
        .delete('/ratings/recipe-999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
