const Problem = require("../models/Problem");
const User = require("../models/User");

exports.createProblem = async (req, res) => {
  try {
    const problem = await Problem.create(req.body);
    res.status(201).json(problem);
  } catch (err) {
    res.status(400).json({ message: "Problem creation failed", error: err.message });
  }
};

exports.getProblems = async (req, res) => {
  try {
    const problems = await Problem.find({});
    const user = await User.findById(req.currUser); // ✅ fetch user

    const solvedSet = new Set(user.solvedProblems.map(p => p.toString())); // ✅ solved problem IDs

    const listWithSolved = problems.map(p => ({
      _id: p._id,
      title: p.title,
      tag: p.tag,
      difficulty: p.difficulty,
      solved: solvedSet.has(p._id.toString()), // ✅ attach solved status
    }));

    res.json(listWithSolved);
  } catch (err) {
    res.status(500).json({ message: "Error loading problems" });
  }
};

exports.getProblemById = async (req, res) => {
  const problem = await Problem.findById(req.params.id);
  res.json(problem);
};

exports.updateProblem = async (req, res) => {
  const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteProblem = async (req, res) => {
  await Problem.findByIdAndDelete(req.params.id);
  res.json({ message: "Problem deleted" });
};
