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
  const { originalUrl } = req.body;
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

async function editUrl(req, res) {
  const { id } = req.params;
  const { originalUrl } = req.body;

  const exisitingUrl = await Url.findOne({ shortID: id });

  if (!exisitingUrl) {
    throw new NotFoundError("Short URL not found");
  }

  if (exisitingUrl.originalUrl === originalUrl) {
    throw new DuplicateData(
      "The new URL must be different from the current original URL."
    );
  }

  const url = await Url.findOneAndUpdate({ shortID: id }, { originalUrl });
  res.status(200).json({ msg: "Url update successful" });
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
  editUrl,
  deleteUrl,
  claimGuestUrls,
};
