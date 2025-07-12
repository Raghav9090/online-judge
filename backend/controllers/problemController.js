const Problem = require("../models/Problem");
const User = require("../models/User");

// Create a new problem
exports.createProblem = async (req, res) => {
  try {
    const problem = await Problem.create(req.body);
    res.status(201).json(problem);
  } catch (err) {
    res.status(400).json({ message: "Problem creation failed", error: err.message });
  }
};

// Get all problems with user’s solved status
exports.getProblems = async (req, res) => {
  try {
    const problems = await Problem.find({});
    const user = await User.findById(req.currUser);

    const solvedSet = new Set(user.solvedProblems.map(p => p.toString()));

    const listWithSolved = problems.map(p => ({
      _id: p._id,
      title: p.title,
      tags: p.tags,
      difficulty: p.difficulty,
      solved: solvedSet.has(p._id.toString()),
    }));

    res.status(200).json(listWithSolved);
  } catch (err) {
    res.status(500).json({ message: "Error loading problems", error: err.message });
  }
};

// Get a single problem by ID (with only visible testcases)
exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).lean();

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Filter only visible test cases
    problem.testcases = problem.testcases?.filter(tc => tc.visible);

    res.status(200).json(problem);
  } catch (err) {
    res.status(500).json({ message: "Error fetching problem", error: err.message });
  }
};

// Update a problem
exports.updateProblem = async (req, res) => {
  try {
    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

// Delete a problem
exports.deleteProblem = async (req, res) => {
  try {
    const deleted = await Problem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json({ message: "Problem deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
