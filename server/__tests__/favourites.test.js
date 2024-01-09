const supertest = require('supertest');
const server = require('../server');
const pool = require('../db/pool');
const seed = require('../db/seed');
const data = require('../db/data/test');
const { createToken } = require('../util/token');

let token;

beforeAll(async () => {
  await seed(data);

  token = createToken(
    (await pool.query('SELECT id, username FROM users;')).rows[0]
  );
});

afterAll(() => {
  pool.end();
});

describe('GET /favourites', () => {
  it('200: should return a list of recipe slugs', async () => {
    const { body } = await supertest(server)
      .get('/favourites')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.favourites).toEqual(expect.any(Array));
    expect(body.favourites[0]).toEqual(expect.any(String));
  });

  describe('error handling', () => {
    it('401: should return an error if user token not provided', async () => {
      await supertest(server).get('/favourites').expect(401);
    });
  });
});

describe('PUT /favourites/:recipe_slug', () => {
  it('204: should add a recipe slug to the favourites list', async () => {
    await supertest(server)
      .put('/favourites/recipe-3')
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const { body } = await supertest(server)
      .get('/favourites')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.favourites).toContain('recipe-3');
  });

  describe('error handling', () => {
    it('401: should return an error if user token not provided', async () => {
      await supertest(server).put('/favourites/recipe-3').expect(401);
    });

    it('404: should return an error if recipe_id is not in database', async () => {
      await supertest(server)
        .put('/favourites/recipe-999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});

describe('DELETE /favourites/:recipe_slug', () => {
  it('204: should remove a recipe slug from the favourites list', async () => {
    await supertest(server)
      .delete('/favourites/recipe-1')
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const { body } = await supertest(server)
      .get('/favourites')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.favourites).not.toContain('recipe-1');
  });

  describe('error handling', () => {
    it('401: should return an error if user token not provided', async () => {
      await supertest(server).delete('/favourites/recipe-1').expect(401);
    });

    it('404: should return an error if recipe_id is not in database', async () => {
      await supertest(server)
        .delete('/favourites/recipe-999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
