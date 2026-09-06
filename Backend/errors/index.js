const BadRequestError = require("./badRequest");
const DuplicateData = require("./duplicate");
const NotFoundError = require("./NotFoundError");
const UnAuthorizedError = require("./unAuthorized");

module.exports = {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
  DuplicateData,
};
