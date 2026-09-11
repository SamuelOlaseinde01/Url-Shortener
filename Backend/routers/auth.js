const express = require("express");
const {
  register,
  login,
  deleteAllUsers,
  getAllUsers,
  deleteUser,
  getCurrentUser,
} = require("../controllers/auth");
const { requireAuthMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/").delete(deleteAllUsers).get(getAllUsers);
router.route("/:id").delete(deleteUser);
router.route("/me").get(requireAuthMiddleware, getCurrentUser);

module.exports = router;
