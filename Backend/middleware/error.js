async function errorHandlingMiddleWare(err, req, res, next) {
  let customError = {
    statusCode: err.statusCode || 500,
    msg: err.message,
    field: err.field,
  };
  if (err.name === "ValidationError") {
    validationErrMsg = Object.values(err.errors)[0];
    customError.msg = validationErrMsg?.message;
    customError.field = validationErrMsg?.path;
    customError.statusCode = 400;
  }
  res.status(customError.statusCode).json(customError);
}

module.exports = errorHandlingMiddleWare;
