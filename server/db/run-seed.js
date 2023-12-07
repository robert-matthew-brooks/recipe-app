const pool = require('./pool');
const seed = require('./seed');
const data = require('./data/dev');

async function runSeed() {
  const client = await pool.connect();

  await seed(client, data);

  await client.release();
  await pool.end();
}
runSeed();
