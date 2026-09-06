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
    user: {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    },
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
    secure: false, // Requires HTTPS in production
    sameSite: "strict", // Protects against CSRF attacks
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Logged in successfully",
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
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
};
