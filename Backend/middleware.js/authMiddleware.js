const jwt = require("jsonwebtoken");
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

  // ALWAYS call next() so guests can still create their single link!
  next();
}

async function requireAuthMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    throw new BadRequestError("Authentication required. Please log in.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

module.exports = { optionalAuthMiddleware, requireAuthMiddleware };
