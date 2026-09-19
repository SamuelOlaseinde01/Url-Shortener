const { customAlphabet } = require("nanoid");
const {
  NotFoundError,
  UnAuthorizedError,
  DuplicateData,
  BadRequestError,
} = require("../errors");
const Url = require("../models/url");

const alphabet =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const nanoid = customAlphabet(alphabet, 7);

async function getAllUrls(req, res) {
  const { user_id } = req.user;
  const allUrls = await Url.find({ user: user_id }).sort({
    createdAt: -1,
  });
  res.status(200).json(allUrls);
}

async function createUrl(req, res) {
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
  } catch (err) {
    throw new BadRequestError(
      "The provided string is not a valid URL structure.",
      "url"
    );
  }

  const user_id = req?.user?.user_id;

  let shortUrl;
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 5) {
    shortUrl = nanoid();
    const duplicateShortUrl = await Url.findOne({ shortenedUrl: shortUrl });

    if (!duplicateShortUrl) {
      isUnique = true;
    }

    attempts++;
  }

  if (!isUnique) {
    throw new Error("Server is busy generating links. Please try again.");
  }

  const newUrl = await Url.create({
    shortenedUrl: shortUrl,
    user: user_id || null,
    originalUrl,
  });

  res.status(201).json(newUrl);
}

async function getUrl(req, res) {
  const { id } = req.params;
  const url = await Url.findOne({ shortID: id });
  if (!url) {
    throw new NotFoundError("This url does not exist.");
  }
  res.status(200).json(url);
}

async function deleteUrl(req, res) {
  const { id } = req.params;
  const url = await Url.findByIdAndDelete(id);
  if (!url) {
    throw new NotFoundError("This url does not exist.");
  }
  res.status(200).json({ msg: "This url has been deleted successfully." });
}

async function claimGuestUrls(req, res) {
  const { urlIds } = req.body;

  if (!urlIds || !Array.isArray(urlIds) || urlIds.length === 0) {
    return res.status(200).json({ msg: "No links to claim" });
  }

  // Update only URLs that belong to nobody (user is null/undefined)
  const result = await Url.updateMany(
    {
      _id: { $in: urlIds },
      user: null, // or user: null depending on schema
    },
    {
      $set: { user: req.user.user_id },
    }
  );

  res.status(200).json({
    success: true,
    claimedCount: result.modifiedCount,
  });
}

module.exports = {
  getUrl,
  getAllUrls,
  createUrl,
  deleteUrl,
  claimGuestUrls,
};
