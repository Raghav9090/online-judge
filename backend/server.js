const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",  // your frontend
  credentials: true                 // ✅ must be true to allow cookies
}));
app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);

const problemRoutes = require("./routes/problemRoutes");
app.use("/api", problemRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);

const compilerRoutes = require("./routes/compilerRoutes");
app.use("/api", compilerRoutes);

const submissionRoutes = require("./routes/submissionRoutes");
app.use("/api", submissionRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
