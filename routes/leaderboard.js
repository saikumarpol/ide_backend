const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/", async (req, res) => {
  const leaderboard = await User.find()
    .sort({ problemsSolved: -1, streak: -1 })
    .select("rollNo name problemsSolved streak");
  res.json(leaderboard);
});

module.exports = router;