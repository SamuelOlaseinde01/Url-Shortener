const { StatusCodes } = require("http-status-codes");

class DuplicateData extends Error {
  constructor(message, field) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
    this.field = field;
  }
}

module.exports = DuplicateData;
