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

  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const nanoid = customAlphabet(alphabet, 7);
  const shortUrl = nanoid();

  const duplicateUrl = await Url.findOne({ shortenedUrl: shortUrl });
  if (duplicateUrl) {
    throw new DuplicateData("This url already exists", "createUrl");
  }
  const newUrl = await Url.create({
    shortenedUrl: shortUrl,
    user: user_id,
    originalUrl,
    shortID,
  });
  res.status(200).json(newUrl);
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
