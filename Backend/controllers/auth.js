const { BadRequestError, NotFoundError } = require("../errors");
const User = require("../models/user");

async function register(req, res) {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    throw new BadRequestError("This field cannot be empty", "generic");
  }
  const exisitingEmail = await User.findOne({ email: email.toLowerCase() });
  if (exisitingEmail)
    throw new BadRequestError("Email already exists", "email");
  const newUser = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    password,
  });
  const token = newUser.createToken();

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "User account created successfully",
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError(
      "Please provide both email and password",
      "generic"
    );
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) throw new BadRequestError("This email does not exist", "email");

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    throw new BadRequestError("This password is incorrect", "password");

  const token = user.createToken();

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Log in successfully",
  });
}
async function getCurrentUser(req, res) {
  const { user_id: id } = req.user;
  const user = await User.findById(id).select("-password");
  res.status(200).json(user);
}

async function getAllUsers(req, res) {
  const users = await User.find({});
  res.json({ users });
}

async function deleteAllUsers(req, res) {
  await User.deleteMany({});
  res.json({ message: "Users deleted successfully" });
}

async function deleteUser(req, res) {
  const { id } = req.params;
  const user = await User.deleteOne({ _id: id });
  res.json({ message: "User deleted successfully" });
}

module.exports = {
  register,
  login,
  deleteAllUsers,
  getAllUsers,
  deleteUser,
  getCurrentUser,
};
