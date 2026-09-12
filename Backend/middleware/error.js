async function errorHandlingMiddleWare(err, req, res, next) {
  let customError = {
    statusCode: err.statusCode || 500,
    msg: err.message || "Something went wrong, please try again later",
    field: err.field || null,
  };

  if (err.name === "ValidationError") {
    const validationErrMsg = Object.values(err.errors)[0];
    customError.msg = validationErrMsg?.message;
    customError.field = validationErrMsg?.path;
    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue)[0];
    customError.msg = `The ${duplicateField} you entered is already in use.`;
    customError.field = duplicateField;
    customError.statusCode = 409;
  }

  if (err.name === "CastError") {
    customError.msg = `No item found with ID: ${err.value}`;
    customError.field = err.path;
    customError.statusCode = 400; // or 404 depending on your preference
  }

  if (err.name === "DocumentNotFoundError") {
    customError.msg = "The requested resource could not be found.";
    customError.statusCode = 404;
  }

  if (customError.statusCode === 500) {
    console.error("❌ Internal Server Error Details:", err);
  }

  res.status(customError.statusCode).json(customError);
}

module.exports = errorHandlingMiddleWare;
