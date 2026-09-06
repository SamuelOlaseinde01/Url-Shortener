const { StatusCodes } = require("http-status-codes");

class NotFoundError extends Error {
  constructor(message, field) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.field = field;
  }
}

module.exports = NotFoundError;
