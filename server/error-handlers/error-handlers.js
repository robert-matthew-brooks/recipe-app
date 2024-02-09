// custom errors

function customErrHandler(err, _req, res, next) {
  if (err.status) {
    res.status(err.status).send(err);
  } else {
    next(err);
  }
}

// psql errors

function psqlErrHandler(err, req, res, next) {
  if (err.code === '23505') {
    res
      .status(409)
      .send({ status: 409, msg: 'PSQL - unique key already exists', err });
  } else if (err.code === '23503') {
    res
      .status(409)
      .send({
        status: 409,
        msg: 'PSQL - cannot delete data referenced by a foreign key',
        err,
      });
  } else if (err.code) {
    console.log(err);
    res.status(500).send({ unhandled_psql_err: err });
  } else {
    next(err);
  }
}

// catch-all

function serverErrHandler(err, _req, res, _next) {
  console.log(err);
  res.status(500).send({ unhandled_server_err: err.toString() });
}

module.exports = { customErrHandler, psqlErrHandler, serverErrHandler };
