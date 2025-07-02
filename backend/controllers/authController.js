const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { username, fullname, email, password, usertype } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      fullname,
      email,
      password: hashedPassword,
      usertype,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });
    res.json({ message: "User registered" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed. Try again later." });
  }
};


// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Allow login via username OR email
    const user = await User.findOne({
      $or: [{ email }, { username: email }] // uses "email" field to search both
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true }).json({ message: "Login successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};


exports.logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
};

exports.dashboard = (req, res) => {
  const user = req.curruser; // Set by isLoggedIn middleware
  res.json({
    message: `Welcome ${user.usertype}`,
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      usertype: user.usertype
    }
  });
};
