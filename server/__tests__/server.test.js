const supertest = require('supertest');
const server = require('../server');

describe('GET /status', () => {
  it('200: should confirm server is up', async () => {
    await supertest(server).get('/status').expect(200);
  });
});

describe('ALL endpoint not found', () => {
  it('404 should return an error', async () => {
    await supertest(server).get('/not-an-endpoint').expect(404);
  });
});
