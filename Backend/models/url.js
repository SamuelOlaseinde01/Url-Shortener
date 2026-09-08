const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema(
  {
    shortenedUrl: {
      type: String,
      required: [true, "A shortened url must be provided!"],
      unique: true,
    },
    shortID: {
      type: String,
      unique: true,
    },
    originalUrl: {
      type: String,
      minlength: 3,
      required: [true, "You must provide a link."],
    },
    urlClickCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

UrlSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 2592000,
    partialFilterExpression: { user: { $exists: false } },
  }
);

module.exports = mongoose.model("Url", UrlSchema);
