const { Pool } = require('pg');
const dotenv = require('dotenv');

const ENV = process.env.NODE_ENV || 'dev';
const dbNameFilepath = `${__dirname}/../.env.${ENV}`;

dotenv.config({ path: dbNameFilepath });

module.exports = new Pool();
