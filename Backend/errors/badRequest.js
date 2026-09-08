const { StatusCodes } = require("http-status-codes");

class BadRequestError extends Error {
  constructor(message, field) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.field = field;
  }
}

module.exports = BadRequestError;
