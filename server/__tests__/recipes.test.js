const supertest = require('supertest');
const matchers = require('jest-extended');
const server = require('../server');
const pool = require('../db/pool');
const seed = require('../db/seed');
const data = require('../db/data/test');
const { createToken } = require('../util/token');
const { makeSlug } = require('../util/sql-functions');

expect.extend(matchers);
let token;
const recipe1 = makeSlug(data.recipes[0].name);
let recipePatchObj;

beforeEach(async () => {
  await seed(data);

  token = createToken(
    (await pool.query('SELECT id, username FROM users;')).rows[0]
  );

  recipePatchObj = {
    name: 'Beans On Toast',
    ingredients: [
      { id: 1, amount: 10 },
      { id: 2, amount: 20 },
    ],
    new_ingredients: [
      { name: 'Beans', units: 'cans', amount: 1 },
      { name: 'Bread', units: 'slices', amount: 2 },
    ],
    steps: [
      'Put bread in toaster and beans in a pan.',
      'Butter toast.',
      'Put hot beans on toast.',
    ],
  };
});

afterAll(async () => {
  await pool.end();
});

describe('GET /recipes/:recipe_id', () => {
  it('200: should return a recipe object with correct properties', async () => {
    const { body } = await supertest(server)
      .get(`/recipes/${recipe1}`)
      .expect(200);

    expect(body.recipe).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      slug: expect.any(String),
      author: expect.any(String),
      img_url: expect.toBeOneOf([expect.any(String), null]),
      ingredients: expect.any(Array),
      steps: expect.any(Array),
      is_vegetarian: expect.any(Boolean),
      created_at: expect.any(String),
      votes: expect.any(Number),
      rating: expect.toBeOneOf([expect.any(Number), null]),
    });

    for (const ingredient of body.recipe.ingredients) {
      expect(ingredient).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        amount: expect.any(Number),
        units: expect.any(String),
      });
    }

    for (const step of body.recipe.steps) {
      expect(typeof step).toBe('string');
    }
  });

  describe('error handling', () => {
    it('404: should return an error if recipe_id is not in database', async () => {
      await supertest(server).get('/recipes/recipe-999').expect(404);
    });
  });
});

describe('GET /recipes', () => {
  it('200: should return an array of recipe objects with the correct properties', async () => {
    const { body } = await supertest(server).get('/recipes').expect(200);

    expect(body).toMatchObject({
      recipes: expect.any(Array),
      total_recipes: expect.any(Number),
    });

    for (const recipe of body.recipes) {
      expect(recipe).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        slug: expect.any(String),
        author: expect.any(String),
        img_url: expect.toBeOneOf([expect.any(String), null]),
        created_at: expect.any(String),
        votes: expect.any(Number),
        rating: expect.toBeOneOf([expect.any(Number), null]),
      });
    }
  });

  it('200: should return 10 recipes from 30 total', async () => {
    const { body } = await supertest(server).get('/recipes').expect(200);
    expect(body.recipes).toHaveLength(10);
    expect(body.total_recipes).toBe(30);
  });

  it('200: should filter 5 tagged recipe names', async () => {
    const { body } = await supertest(server)
      .get('/recipes?search_term=tag')
      .expect(200);

    expect(body.recipes).toHaveLength(5);
    expect(body.total_recipes).toBe(5);
  });

  it('200: should allow URI encoded strings with % symbol', async () => {
    await supertest(server)
      .get('/recipes?search_term=string%20with%20spaces')
      .expect(200);

    const encodedSearchTerm = encodeURI('string with spaces');

    await supertest(server)
      .get(`/recipes?search_term=${encodedSearchTerm}`)
      .expect(200);
  });

  it('200: should filter 21 recipes with specific ingredients', async () => {
    const ingredientIdsStr = JSON.stringify([1, 3]);

    const { body } = await supertest(server)
      .get(`/recipes?ingredient_ids=${ingredientIdsStr}&limit=999`)
      .expect(200);

    expect(body.recipes).toHaveLength(21);
    expect(body.total_recipes).toBe(21);
  });

  it('200: should filter 2 favourite recipes', async () => {
    const { body } = await supertest(server)
      .get('/recipes?is_favourites=true')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.recipes).toHaveLength(2);
    expect(body.total_recipes).toBe(2);
  });

  it('200: should filter 9 vegetarian recipes', async () => {
    const { body } = await supertest(server)
      .get('/recipes?is_vegetarian=true')
      .expect(200);

    expect(body.recipes).toHaveLength(9);
    expect(body.total_recipes).toBe(9);
  });

  describe('sorting', () => {
    it('200: should order recipes by date', async () => {
      const { body } = await supertest(server)
        .get('/recipes?sort=new')
        .expect(200);

      const timestamps = body.recipes.map((recipe) => recipe.created_at);

      expect(timestamps).toEqual(
        [...timestamps].sort((a, b) => {
          return Date.parse(a) < Date.parse(b) ? 1 : -1;
        })
      );
    });

    it('200: should order recipes by number of likes', async () => {
      const { body } = await supertest(server)
        .get('/recipes?sort=top')
        .expect(200);

      const likes = body.recipes.map((recipe) => recipe.likes);

      expect(likes).toEqual(
        [...likes].sort((a, b) => {
          return a < b ? 1 : -1;
        })
      );
    });

    it('200: should order recipes by name', async () => {
      const { body } = await supertest(server)
        .get('/recipes?sort=az')
        .expect(200);

      const names = body.recipes.map((recipe) => recipe.name);

      expect(names).toEqual([...names].sort());
    });

    it('200: should order recipes by name in reverse order', async () => {
      const { body } = await supertest(server)
        .get('/recipes?sort=za')
        .expect(200);

      const names = body.recipes.map((recipe) => recipe.name);

      expect(names).toEqual([...names].sort().reverse());
    });
  });

  describe('pagination', () => {
    it('200: should return specified number of recipes', async () => {
      const { body } = await supertest(server)
        .get('/recipes?limit=6')
        .expect(200);
      expect(body.recipes).toHaveLength(6);
    });

    it('200: should return different recipes for different specified pages', async () => {
      const { body: body1 } = await supertest(server)
        .get('/recipes?page=1')
        .expect(200);

      const { body: body2 } = await supertest(server)
        .get('/recipes?page=2')
        .expect(200);

      const recipeIds1 = body1.recipes.map((recipe) => recipe.id);
      const recipeIds2 = body2.recipes.map((recipe) => recipe.id);

      recipeIds1.forEach((recipeId) => {
        expect(recipeIds2).not.toContain(recipeId);
      });
    });
  });

  describe('error handling', () => {
    it('400: should return an error if tag is not valid', async () => {
      await supertest(server)
        .get('/recipes?search_term=i*n*v*a*l*i*d')
        .expect(400);
    });

    it('400: should return an error if ingredient id values not valid', async () => {
      const ingredientIdsStr = JSON.stringify([1, 2, 3, 'invalid']);

      await supertest(server)
        .get(`/recipes?ingredient_ids=${ingredientIdsStr}`)
        .expect(400);
    });

    it('401: should return an error if token for favourites is not valid', async () => {
      await supertest(server)
        .get('/recipes?is_favourites=true')
        .set('Authorisation', 'Bearer invalid')
        .expect(401);
    });

    it('400: should return an error if sort option is not in whitelist', async () => {
      await supertest(server).get('/recipes?sort=not_in_whitelist').expect(400);
    });

    it('400: should return an error if limit is not a number', async () => {
      await supertest(server).get('/recipes?limit=NaN').expect(400);
    });

    it('400: should return an error if page is not a number', async () => {
      await supertest(server).get('/recipes?page=NaN').expect(400);
    });
  });
});

describe('GET /recipes?is_todos=true', () => {
  it('200: should return an array of recipe objects with the correct properties', async () => {
    const { body } = await supertest(server)
      .get('/recipes?is_todos=true')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    for (const recipe of body.recipes) {
      expect(recipe).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        slug: expect.any(String),
        author: expect.any(String),
        img_url: expect.toBeOneOf([expect.any(String), null]),
        created_at: expect.any(String),
        votes: expect.any(Number),
        rating: expect.toBeOneOf([expect.any(Number), null]),
      });
    }
  });

  it('200: should return 3 todo recipes', async () => {
    const { body } = await supertest(server)
      .get('/recipes?is_todos=true')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.recipes).toHaveLength(3);
    expect(body.total_recipes).toBe(3);
  });

  describe('error handling', () => {
    it('401: should return an error if token for todos is not valid', async () => {
      await supertest(server).get('/recipes?is_todos=true').expect(401);
    });
  });
});

describe('PATCH /recipes/:recipe_slug', () => {
  it('200: should return a new recipe object with correct properties', async () => {
    const { body } = await supertest(server)
      .patch(`/recipes/${recipe1}`)
      .set('Authorization', `Bearer ${token}`)
      .send(recipePatchObj)
      .expect(200);

    expect(body.recipe).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      slug: expect.any(String),
      author: expect.any(String),
      img_url: expect.toBeOneOf([expect.any(String), null]),
      ingredients: expect.any(Array),
      steps: expect.any(Array),
      is_vegetarian: expect.any(Boolean),
      created_at: expect.any(String),
      votes: expect.any(Number),
      rating: expect.toBeOneOf([expect.any(Number), null]),
    });

    for (const ingredient of body.recipe.ingredients) {
      expect(ingredient).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        amount: expect.any(Number),
        units: expect.any(String),
      });
    }

    for (const step of body.recipe.steps) {
      expect(typeof step).toBe('string');
    }
  });

  describe('error handling', () => {
    it('401: should return an error if token is not valid', async () => {
      await supertest(server)
        .patch(`/recipes/${recipe1}`)
        .set('Authorisation', 'Bearer invalid')
        .send(recipePatchObj)
        .expect(401);
    });

    it('404: should return an error if recipe_id is not in database', async () => {
      await supertest(server)
        .patch('/recipes/recipe-999')
        .set('Authorization', `Bearer ${token}`)
        .send(recipePatchObj)
        .expect(404);
    });

    it('403: should return an error if the token user does not match the recipe author', async () => {
      tokenUser2 = createToken(
        (await pool.query('SELECT id, username FROM users;')).rows[1]
      );

      await supertest(server)
        .patch(`/recipes/${recipe1}`)
        .set('Authorization', `Bearer ${tokenUser2}`)
        .send(recipePatchObj)
        .expect(403);
    });

    it('400: should return an error if ingredient id is not a number', async () => {
      recipePatchObj.ingredients[0].id = 'a';

      await supertest(server)
        .patch(`/recipes/${recipe1}`)
        .set('Authorization', `Bearer ${token}`)
        .send(recipePatchObj)
        .expect(400);
    });

    it('400: should return an error if ingredient amount is not a number', async () => {
      recipePatchObj.ingredients[0].amount = 'ten';

      await supertest(server)
        .patch(`/recipes/${recipe1}`)
        .set('Authorization', `Bearer ${token}`)
        .send(recipePatchObj)
        .expect(400);
    });

    it('409: should return an error if recipe slug already exists', async () => {
      recipePatchObj.name = data.recipes[1].name;

      await supertest(server)
        .patch(`/recipes/${recipe1}`)
        .set('Authorization', `Bearer ${token}`)
        .send(recipePatchObj)
        .expect(409);
    });
  });
});

describe('DELETE /recipes/:recipe_slug', () => {
  it('204: should delete specified recipe', async () => {
    const { body } = await supertest(server)
      .delete(`/recipes/${recipe1}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    expect(
      (
        await pool.query(
          `
            SELECT * FROM recipes
            WHERE slug = '${recipe1}';
          `
        )
      ).rows
    ).toHaveLength(0);
  });

  describe('error handling', () => {
    it('401: should return an error if token is not valid', async () => {
      await supertest(server)
        .delete(`/recipes/${recipe1}`)
        .set('Authorisation', 'Bearer invalid')
        .expect(401);
    });

    it('404: should return an error if recipe_id is not in database', async () => {
      await supertest(server)
        .delete('/recipes/recipe-999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('403: should return an error if the token user does not match the recipe author', async () => {
      tokenUser2 = createToken(
        (await pool.query('SELECT id, username FROM users;')).rows[1]
      );

      await supertest(server)
        .delete(`/recipes/${recipe1}`)
        .set('Authorization', `Bearer ${tokenUser2}`)
        .expect(403);
    });
  });
});
