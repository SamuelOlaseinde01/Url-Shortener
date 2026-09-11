const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");

const UrlSchema = new mongoose.Schema(
  {
    shortenedUrl: {
      type: String,
      required: [true, "A shortened url must be provided!"],
      unique: true,
    },
    shortID: {
      type: String,
      sparse: true,
      unique: true,
    },
    originalUrl: {
      type: String,
      maxlength: [
        2048,
        "URL is too long. Browsers do not support URLs over 2048 characters.",
      ],
      required: [true, "You must provide a link."],
      trim: true,
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

UrlSchema.pre("save", async function () {
  if (this.isNew && this.user) {
    const alphabet =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    const nanoid = customAlphabet(alphabet, 7);
    let attempts = 0;
    let isUnique = false;
    while (!isUnique && attempts < 5) {
      const generatedID = nanoid();
      const existingID = await this.constructor.findOne({
        shortID: generatedID,
      });

      if (!existingID) {
        isUnique = true;
        this.shortID = generatedID;
      }

      attempts++;
    }
    if (!isUnique) {
      return next(
        new Error("Server busy: Could not generate a unique shortID.")
      );
    }
  }
});

module.exports = mongoose.model("Url", UrlSchema);
