async function errorHandlingMiddleWare(err, req, res, next) {
  let customError = {
    statusCode: err.statusCode || 500,
    msg: err.message,
  };
  res.status(customError.statusCode).json({ msg: customError.msg });
  next();
}

module.exports = errorHandlingMiddleWare;
