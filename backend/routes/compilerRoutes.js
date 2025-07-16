const express = require("express");
const router = express.Router();

const { submitCode, runCode } = require("../controllers/compilerController");
const { getUserSubmissions } = require("../controllers/submissionController"); // ✅ FIXED

const isLoggedIn = require("../middleware/isLoggedIn");

router.post("/submitcode/:id", isLoggedIn, submitCode);   // ✅ Submit with testcases
router.post("/submitcode", runCode);                      // ✅ Run with custom input
router.get("/submissions/:id", isLoggedIn, getUserSubmissions); // ✅ View submissions for a problem

module.exports = router;
