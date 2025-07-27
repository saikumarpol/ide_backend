// const express = require("express");
// const User = require("../models/User");
// const router = express.Router();

// router.get("/", async (req, res) => {
//   const leaderboard = await User.find()
//     .sort({ problemsSolved: -1, streak: -1 })
//     .select("rollNo name problemsSolved streak");
//   res.json(leaderboard);
// });

// module.exports = router;

const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Leaderboard route with tie-breaker
router.get("/", async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ problemsSolved: -1, lastSolvedDate: 1 }) // main sort + tie-breaker
      .select("rollNo name problemsSolved streak lastSolvedDate");
    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
