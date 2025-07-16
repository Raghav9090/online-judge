const User = require("../models/User");

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.currUser).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Convert ObjectIds to strings for the frontend
    const solvedProblems = user.solvedProblems.map(id => id.toString());

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        usertype: user.usertype,
        solvedProblems: solvedProblems, // ✅ return stringified problem IDs
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
