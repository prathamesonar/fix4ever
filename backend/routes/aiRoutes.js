const express = require("express");
const router = express.Router();
const { getSuggestions } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.post("/suggest", protect, getSuggestions);

module.exports = router;
