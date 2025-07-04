const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// ✅ Allow multiple frontend origins (dev and prod)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps or curl/postman
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

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// ✅ Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
