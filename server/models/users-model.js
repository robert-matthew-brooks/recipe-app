const pool = require('../db/pool');
const { verifyToken, createToken } = require('../util/token');
const { hash } = require('../util/encrypt');
const validate = require('../util/validate');

async function register(username, password) {
  validate.rejectIfInvalidUsername(username);
  validate.rejectIfInvalidPassword(password);

  const hashedPassword = hash(password);

  const { rows } = await pool.query(
    `
      INSERT INTO users (username, hashed_password)
      VALUES ($1, $2)
      RETURNING id, username;
    `,
    [username, hashedPassword]
  );

  const token = createToken(rows[0]);
  const user = { ...rows[0], token };

  return { user };
}

async function login(username, password, token) {
  if (username && password) {
    // validate
    //  - check format
    // retrieve from database
    // call createToken
  } else if (token) {
    const user = verifyToken(token);
    // retrieve from database
  } else {
    throw { status: 401, msg: 'No credentials or token provided' };
  }
}

//TODO split this into smaller functions
async function getOne(username) {
  await validate.rejectIfNotInDb(username, 'username', 'users');

  const { rows } = await pool.query(
    `
      SELECT
        u.id,
        u.username,
        ARRAY_AGG(DISTINCT f.slug) AS favourites,
        ARRAY_AGG(DISTINCT l.slug) AS list,
        ARRAY_AGG(DISTINCT d.slug) AS done

      FROM users u

      LEFT OUTER JOIN (
        SELECT u.id, r.slug FROM users u
        CROSS JOIN UNNEST(u.favourites) f
        INNER JOIN recipes r
          ON f = r.id
        WHERE u.username = $1
      ) f
        ON u.id = f.id

      LEFT OUTER JOIN (
        SELECT u.id, r.slug FROM users u
        CROSS JOIN UNNEST(u.list) l
        INNER JOIN recipes r
          ON l = r.id
        WHERE u.username = $1
      ) l
        ON u.id = l.id

      LEFT OUTER JOIN (
        SELECT u.id, r.slug FROM users u
        CROSS JOIN UNNEST(u.done) d
        INNER JOIN recipes r
          ON d = r.id
        WHERE u.username = $1
      ) d
        ON u.id = d.id

      WHERE u.username = $1
      GROUP BY u.id;
    `,
    [username]
  );

  // psql returns [null] for empty array aggregate...
  rows[0].favourites = rows[0].favourites.filter((el) => el !== null);
  rows[0].list = rows[0].list.filter((el) => el !== null);
  rows[0].done = rows[0].done.filter((el) => el !== null);

  return { user: rows[0] };
}

module.exports = { register, login, getOne };
