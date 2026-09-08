const { customAlphabet } = require("nanoid");
const {
  NotFoundError,
  UnAuthorizedError,
  DuplicateData,
  BadRequestError,
} = require("../errors");
const Url = require("../models/url");

async function getAllUrls(req, res) {
  const { user_id } = req.user;
  const allUrls = await Url.find({ user: user_id });
  res.status(200).json({ allUrls });
}

async function createUrl(req, res) {
  const { originalUrl } = req.body;
  if (!originalUrl) {
    throw new BadRequestError("This field is required", "url");
  }

  const user_id = req?.user?.user_id;
  const shortID = req?.user?.shortID;

  if (!user_id) {
    const duplicateOriginalUrl = await Url.findOne({
      originalUrl: originalUrl,
      user: null,
    });
    if (duplicateOriginalUrl) {
      return res.status(200).json(duplicateOriginalUrl);
    }
  }
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const nanoid = customAlphabet(alphabet, 7);

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
    shortID,
  });

  res.status(201).json(newUrl);
}

async function getUrl(req, res) {
  const { id } = req.params;
  const url = await Url.findOne({ shortID: id });
  if (!url) {
    throw new NotFoundError("This url does not exist.");
  }
  res.status(200).json({ url });
}

async function deleteUrl(req, res) {
  const { id } = req.params;
  const url = await Url.findByIdAndDelete(id);
  if (!url) {
    throw new NotFoundError("This url does not exist.");
  }
  res.status(200).json({ msg: "This url has been deleted successfully." });
}

module.exports = {
  getUrl,
  getAllUrls,
  createUrl,
  deleteUrl,
};
