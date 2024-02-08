const supertest = require('supertest');
const server = require('../server');
const pool = require('../db/pool');
const seed = require('../db/seed');
const data = require('../db/data/test');
const { createToken } = require('../util/token');
const { makeSlug } = require('../util/sql-functions');

let token;
const recipe1 = makeSlug(data.recipes[0].name);
const recipe5 = makeSlug(data.recipes[4].name);

beforeAll(async () => {
  await seed(data);

  token = createToken(
    (await pool.query('SELECT id, username FROM users;')).rows[0]
  );
});

afterAll(() => {
  pool.end();
});

describe('PUT /todos/:recipe_slug', () => {
  it('204: should add a recipe slug to the todos list', async () => {
    await supertest(server)
      .put(`/todos/${recipe1}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const { body } = await supertest(server)
      .get('/todos')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.todos).toContain(recipe1);
  });

  describe('error handling', () => {
    it('401: should return an error if user token not provided', async () => {
      await supertest(server).put(`/todos/${recipe1}`).expect(401);
    });

    it('404: should return an error if recipe_id is not in database', async () => {
      await supertest(server)
        .put('/todos/recipe-999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});

describe('DELETE /todos/:recipe_slug', () => {
  it('204: should remove a recipe slug from the todos list', async () => {
    await supertest(server)
      .delete(`/todos/${recipe5}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const { body } = await supertest(server)
      .get('/todos')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.todos).not.toContain(recipe5);
  });

  describe('error handling', () => {
    it('401: should return an error if user token not provided', async () => {
      await supertest(server).delete(`/todos/${recipe5}`).expect(401);
    });

    it('404: should return an error if recipe_id is not in database', async () => {
      await supertest(server)
        .delete('/todos/recipe-999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
