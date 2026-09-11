const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide your first name"],
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please provide your last name"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Please provide your email"],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please fill a valid email address",
      ],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, "Please provide your password"],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (plainPassword) {
  const isMatch = await bcrypt.compare(plainPassword, this.password);
  return isMatch;
};

UserSchema.methods.createToken = function () {
  const token = jwt.sign(
    { user_id: this._id, user_email: this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  return token;
};

module.exports = mongoose.model("User", UserSchema);
