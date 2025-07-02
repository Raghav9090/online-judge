const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  inputFormat: { type: String, required: true },
  outputFormat: { type: String, required: true },
  sampleInput: { type: String, required: true },
  sampleOutput: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
  tags: [String],
  starterCode: {
    cpp: { type: String, default: "" },
    python: { type: String, default: "" },
    java: { type: String, default: "" },
    c: { type: String, default: "" },
  },
  testcases: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true },
      visible: { type: Boolean, default: false }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Problem", problemSchema);
