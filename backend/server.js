const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// ✅ Allow multiple frontend origins (dev + production)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://3.111.39.120:3000'  // EC2 deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Route mounting
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/problemRoutes"));
app.use("/api", require("./routes/userRoutes"));
app.use("/api", require("./routes/compilerRoutes"));
app.use("/api", require("./routes/submissionRoutes"));
const hintRoute = require("./routes/hint");
app.use("/api/hint", hintRoute);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// ✅ Start server — listen on all interfaces for EC2
app.listen(5000, '0.0.0.0', () => {
  console.log("Server running on http://0.0.0.0:5000");
});
