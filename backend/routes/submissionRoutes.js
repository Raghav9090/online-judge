const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const Submission = require("../models/Submission");

// GET /api/mysubmissions - all submissions by the current user
router.get("/mysubmissions", isLoggedIn, async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.currUser })
      .populate("problem", "title")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
});

module.exports = router;
