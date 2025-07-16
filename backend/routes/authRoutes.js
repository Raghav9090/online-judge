const express = require("express");
const { signup, login, logout } = require("../controllers/authController");
const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/test", (req, res) => {
  res.send("API working ✅");
});


module.exports = router;
// This code defines the authentication routes for user signup, login, and logout.
// It uses Express.js to create a router and maps the routes to the corresponding controller functions. 