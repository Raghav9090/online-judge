const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    if (!req.currUser) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const user = await User.findById(req.currUser);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.usertype !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    next();
  } catch (err) {
    console.error("Error in isAdmin middleware:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
