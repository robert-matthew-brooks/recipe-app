const pool = require('./pool');
const seed = require('./seed');
const data = require('./data/dev');

async function runSeed() {
  await seed(data);
  await pool.end();
}
runSeed();
