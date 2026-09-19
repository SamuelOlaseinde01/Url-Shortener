const express = require("express");
const {
  getUrl,
  getAllUrls,
  createUrl,
  deleteUrl,
  claimGuestUrls,
} = require("../controllers/urlfunctions");
const {
  requireAuthMiddleware,
  optionalAuthMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(requireAuthMiddleware, getAllUrls)
  .post(optionalAuthMiddleware, createUrl);
router
  .route("/:id")
  .get(requireAuthMiddleware, getUrl)
  .delete(requireAuthMiddleware, deleteUrl);
router.route("/claim").post(requireAuthMiddleware, claimGuestUrls);

module.exports = router;
