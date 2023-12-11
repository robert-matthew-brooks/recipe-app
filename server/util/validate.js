const pool = require('../db/pool');
const format = require('pg-format');

function rejectIfFailsRegex(values, regexStr) {
  const regex = new RegExp(regexStr, 'i');
  for (const key in values) {
    if (!regex.test(values[key])) {
      throw { status: 400, msg: `invalid ${key}` };
    }
  }
}

async function rejectIfNotInDb(value, field, table) {
  const { rows } = await pool.query(
    format(
      `
        SELECT * FROM %s
        WHERE %s = %L;
      `,
      table,
      field,
      value
    )
  );

  if (rows.length === 0) {
    throw {
      status: 404,
      msg: `provided ${field} not found in ${table} table`,
    };
  }
}

module.exports = { rejectIfFailsRegex, rejectIfNotInDb };
