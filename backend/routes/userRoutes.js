const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controllers/userController");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/dashboard", isLoggedIn, getDashboard);

module.exports = router;
