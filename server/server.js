const express = require('express');

const server = express();

server.get('/status', (_req, res, _next) => {
  res.send('OK');
});

server.all('*', (_req, res, _next) => {
  res.status(404).send('endpoint not found');
});

module.exports = server;
