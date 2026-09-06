const express = require("express");
const {
  register,
  login,
  deleteAllUsers,
  getAllUsers,
  deleteUser,
} = require("../controllers/auth");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/").delete(deleteAllUsers).get(getAllUsers);
router.route("/:id").delete(deleteUser);

module.exports = router;
