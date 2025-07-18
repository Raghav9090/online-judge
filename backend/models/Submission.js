const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    verdict: { type: String, required: true },
    passed: Number,
    total: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
