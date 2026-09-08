async function errorHandlingMiddleWare(err, req, res, next) {
  let customError = {
    statusCode: err.statusCode || 500,
    msg: err.message,
    field: err.field,
  };
  res
    .status(customError.statusCode)
    .json({ msg: customError.msg, field: customError.field });
}

module.exports = errorHandlingMiddleWare;
