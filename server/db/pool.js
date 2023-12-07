const { Pool } = require('pg');
const dotenv = require('dotenv');

const ENV = process.env.NODE_ENV || 'dev';
const path = `${__dirname}/../.env.${ENV}`;

dotenv.config({ path });

module.exports = new Pool();
