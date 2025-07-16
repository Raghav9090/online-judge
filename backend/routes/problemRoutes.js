const express = require("express");
const router = express.Router();

const {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem
} = require("../controllers/problemController");

const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

// 🟢 Create a new problem (Admin only)
router.post("/createproblem", isLoggedIn, isAdmin, createProblem);

// 🟡 Get list of all problems (authenticated users)
router.get("/problemlist", isLoggedIn, getProblems);

// 🟡 Get a specific problem by ID (used in editor view)
router.get("/problem/:id", isLoggedIn, getProblemById);

// 🟠 Update a problem by ID (Admin only)
router.put("/problem/:id", isLoggedIn, isAdmin, updateProblem);

// 🔴 Delete a problem by ID (Admin only)
router.delete("/problem/:id", isLoggedIn, isAdmin, deleteProblem);

module.exports = router;
