const { StatusCodes } = require("http-status-codes");

class UnAuthorizedError extends Error {
  constructor(message, field) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.field = field;
  }
}

module.exports = UnAuthorizedError;
