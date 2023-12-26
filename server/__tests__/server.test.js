const supertest = require('supertest');
const server = require('../server');
const endpointsJson = require('../endpoints.json');

describe('GET /', () => {
  it('should respond with the endpoint details json document', async () => {
    const { body } = await supertest(server).get('/');
    expect(body).toEqual(endpointsJson);
  });
});

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
