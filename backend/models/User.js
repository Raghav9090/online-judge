const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  fullname: String,
  email: { type: String, unique: true },
  password: String,
  usertype: { type: String, enum: ["user", "admin"], default: "user" },

  // 🆕 Track solved problems
  solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
