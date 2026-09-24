const { BadRequestError } = require("../errors");

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

  // Structural parsing using native Node.js 'URL' class
  try {
    const parsedUrl = new URL(originalUrl);

    // Block non-web protocols (e.g., javascript:, mailto:, ftp:)
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new BadRequestError(
        "URL must start with http:// or https://",
        "url"
      );
    }

    const hostname = parsedUrl.hostname;

    if (hostname.length === 0) {
      throw new BadRequestError("URL must contain a valid domain.", "url");
    }

    // --- NEW TLD VALIDATION CODE START ---

    // RegEx rules:
    // 1. Must end with a letter-only TLD that is between 2 and 63 characters long
    // 2. OR must be an IP address (v4 or v6) if your application allows it (e.g., http://127.0.0.1)
    // 3. Handles localhost
    const isLocalhost = hostname === "localhost";
    const isValidTLD = /\.[a-z]{2,63}$/i.test(hostname);
    const isIpAddress =
      /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.startsWith("[");

    if (!isLocalhost && !isValidTLD && !isIpAddress) {
      throw new BadRequestError(
        "URL must have a valid domain extension (like .com or .org).",
        "url"
      );
    }

    // --- NEW TLD VALIDATION CODE END ---

    console.log(originalUrl);
    req.body.originalUrl = originalUrl;
    next();
  } catch (err) {
    // If the error was thrown explicitly above, pass it along
    if (err instanceof BadRequestError) {
      throw err;
    }
    // Otherwise, it's a native URL parsing failure
    throw new BadRequestError(
      "The provided string is not a valid URL structure.",
      "url"
    );
  }
}

module.exports = urlMiddleware;
