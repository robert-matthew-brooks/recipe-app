const pool = require('../db/pool');
const { rejectIfNotInDb } = require('../util/validate');

async function getOne(userName) {
  await rejectIfNotInDb(userName, 'name', 'users');

  const { rows } = await pool.query(
    `
      SELECT
        u.id,
        u.name,
        ARRAY_AGG(DISTINCT f.slug) AS favourites,
        ARRAY_AGG(DISTINCT l.slug) AS list,
        ARRAY_AGG(DISTINCT d.slug) AS done

      FROM users u

      LEFT OUTER JOIN (
        SELECT u.id, r.slug FROM users u
        CROSS JOIN UNNEST(u.favourites) f
        INNER JOIN recipes r
          ON f = r.id
        WHERE u.name = $1
      ) f
        ON u.id = f.id

      LEFT OUTER JOIN (
        SELECT u.id, r.slug FROM users u
        CROSS JOIN UNNEST(u.list) l
        INNER JOIN recipes r
          ON l = r.id
        WHERE u.name = $1
      ) l
        ON u.id = l.id

      LEFT OUTER JOIN (
        SELECT u.id, r.slug FROM users u
        CROSS JOIN UNNEST(u.done) d
        INNER JOIN recipes r
          ON d = r.id
        WHERE u.name = $1
      ) d
        ON u.id = d.id

      WHERE u.name = $1
      GROUP BY u.id;
    `,
    [userName]
  );

  // psql returns [null] for empty array aggregate...
  rows[0].favourites = rows[0].favourites.filter((el) => el !== null);
  rows[0].list = rows[0].list.filter((el) => el !== null);
  rows[0].done = rows[0].done.filter((el) => el !== null);

  return { user: rows[0] };
}

module.exports = { getOne };
