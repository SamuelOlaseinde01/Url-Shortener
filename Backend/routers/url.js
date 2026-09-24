const express = require("express");
const {
  getUrl,
  getAllUrls,
  createUrl,
  deleteUrl,
  claimGuestUrls,
  editUrl,
} = require("../controllers/urlfunctions");

const {
  requireAuthMiddleware,
  optionalAuthMiddleware,
} = require("../middleware/authMiddleware");

const urlMiddleware = require("../middleware/urlMiddleware");

const router = express.Router();

router
  .route("/")
  .get(requireAuthMiddleware, getAllUrls)
  .post(optionalAuthMiddleware, urlMiddleware, createUrl);
router
  .route("/:id")
  .get(requireAuthMiddleware, getUrl)
  .patch(requireAuthMiddleware, urlMiddleware, editUrl)
  .delete(requireAuthMiddleware, deleteUrl);
router.route("/claim").post(requireAuthMiddleware, claimGuestUrls);

module.exports = router;
