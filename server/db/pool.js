const { Pool } = require('pg');
const { setEnvVars } = require('../env');

if (!process.env.PGDATABASE) setEnvVars(); // read .env if called before server started
if (!process.env.PGDATABASE) {
  console.log('database environment variable not set');
}

// TODO if process.env.NODE_ENV === prod, set pool config

module.exports = new Pool();
