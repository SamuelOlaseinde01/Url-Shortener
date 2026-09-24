import { BadRequestError } from "../errors";

async function urlMiddleware(req, res, next) {
  let { originalUrl } = req.body;
  if (!originalUrl) {
    throw new BadRequestError("This field is required", "url");
  }

  originalUrl = originalUrl.trim();

  if (originalUrl.length < 11) {
    throw new BadRequestError(
      "URL is too short. It must be at least 11 characters.",
      "url"
    );
  }

  // 2. Structural parsing using native Node.js 'URL' class
  try {
    const parsedUrl = new URL(originalUrl);

    // Block non-web protocols (e.g., javascript:, mailto:, ftp:)
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new BadRequestError(
        "URL must start with http:// or https://",
        "url"
      );
    }

    if (parsedUrl.hostname.length === 0) {
      throw new BadRequestError("URL must contain a valid domain.", "url");
    }
    next();
  } catch (err) {
    throw new BadRequestError(
      "The provided string is not a valid URL structure.",
      "url"
    );
  }

  req.body.originalUrl = originalUrl;
}

module.exports = urlMiddleware;
