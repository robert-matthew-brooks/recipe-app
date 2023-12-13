const dotenv = require('dotenv');

const nodeEnv = process.env.NODE_ENV || 'dev';

function setEnvVars() {
  dotenv.config({ path: `${__dirname}/.env.${nodeEnv}` });
}

module.exports = { nodeEnv, setEnvVars };
