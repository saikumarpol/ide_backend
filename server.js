const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const leaderboardRoutes = require("./routes/leaderboard");
const progressRoutes = require("./routes/progress");

const app = express();
app.use(express.json());

// List of allowed frontend URLs
const allowedOrigins = [
  "http://localhost:3000",
  "https://codeine-9nep.vercel.app",
  "https://codeine-9nep-git-main-saikumars-projects-4be89848.vercel.app",
  "https://codeine-9nep-fvcxkre1q-saikumars-projects-4be89848.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use("/auth", authRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/", progressRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
