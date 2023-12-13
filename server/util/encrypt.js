const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

function hash(string) {
  return bcrypt.hashSync(string, salt);
}

function compare(string1, string2) {
  return bcrypt.compareSync(string1, string2);
}

module.exports = { hash, compare };
