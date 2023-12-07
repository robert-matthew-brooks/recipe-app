const supertest = require('supertest');
const pool = require('../db/pool');
const server = require('../server');

describe('ALL endpoint not found', () => {
  it('404 should return an error', async () => {
    await supertest(server).get('/not-an-endpoint').expect(404);
  });
});

// comment to test triggering github actions
