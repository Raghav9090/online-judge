const Submission = require("../models/Submission");

exports.getUserSubmissions = async (req, res) => {
  const { id } = req.params; // problem ID
  const userId = req.currUser;

  try {
    const submissions = await Submission.find({
      user: userId,
      problem: id,
    }).sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (err) {
    console.error("Fetch Submissions Error:", err);
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
};
