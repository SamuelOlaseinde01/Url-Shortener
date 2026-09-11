const jwt = require("jsonwebtoken");
const { customAlphabet } = require("nanoid");
const { BadRequestError, NotFoundError } = require("../errors");

async function optionalAuthMiddleware(req, res, next) {
  const token = req.cookies?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user if token is valid
    } catch (error) {
      throw new BadRequestError("Invalid or expired token.");
    }
  }

  next();
}

async function requireAuthMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    throw new NotFoundError("Authentication required. Please log in.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new BadRequestError("Invalid or expired token.");
  }
}

module.exports = { optionalAuthMiddleware, requireAuthMiddleware };
