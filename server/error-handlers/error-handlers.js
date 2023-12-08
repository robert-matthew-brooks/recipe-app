// custom errors

function customErrHandler(err, _req, res, next) {
  if (err.status) {
    res.status(err.status).send({ serverError: err });
  } else {
    next(err);
  }
}

// catch-all

function serverErrHandler(err, _req, res, _next) {
  console.log(err);
  res.status(500).send({ serverError: err });
}

module.exports = { customErrHandler, serverErrHandler };
