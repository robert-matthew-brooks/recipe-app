const pool = require('../db/pool');
const format = require('pg-format');

// this should match the CLIENT file in client/util/validate.js

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

function rejectIfNotInList(values, list) {
  for (const key in values) {
    if (!list.includes(values[key])) {
      throw { status: 400, msg: `${key} not in allowlist` };
    }
  }
}

function rejectIfInvalidUsername(username) {
  if (username) {
    if (username.length >= 3 && username.length <= 20) {
      if (/^[A-z\d]+$/.test(username) && /^[A-z]/.test(username)) {
        return;
      }
    }
  }

  throw { status: 400, msg: 'invalid username' };
}

function rejectIfInvalidPassword(password) {
  if (password) {
    if (password.length >= 3 && password.length <= 20) {
      if (/[A-z]/.test(password) && /\d/.test(password)) {
        return;
      }
    }
  }

  throw { status: 400, msg: 'invalid password' };
}

module.exports = {
  rejectIfFailsRegex,
  rejectIfNotInDb,
  rejectIfNotInList,
  rejectIfInvalidUsername,
  rejectIfInvalidPassword,
};
