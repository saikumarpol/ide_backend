const express = require("express");
const User = require("../models/User");
const router = express.Router();

function calculateStreak(user) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    if (!user.lastSolvedDate) return 1;
  
    const lastDate = new Date(user.lastSolvedDate);
    lastDate.setHours(0, 0, 0, 0);
  
    const diffDays = (today - lastDate) / (1000 * 60 * 60 * 24);
  
    if (diffDays === 1) {
      return user.streak + 1; // consecutive day → increase streak
    } else if (diffDays === 0) {
      return user.streak; // already solved today → no change
    } else {
      return 1; // missed one or more days → reset
    }
  }
  
router.post("/updateProgress", async (req, res) => {
  const { rollNo, problemId } = req.body;
  try {
    const user = await User.findOne({ rollNo });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.solvedProblems.includes(problemId)) {
      user.solvedProblems.push(problemId.toString());
      user.problemsSolved = user.solvedProblems.length;
      user.streak = calculateStreak(user);
      user.lastSolvedDate = new Date();
      await user.save();
    }

    res.json({ 
      message: "Progress updated", 
      solvedProblems: user.solvedProblems 
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating progress", error: err.message });
  }
});

  

// get user solved problems
router.get("/user/:rollNo", async (req, res) => {
  try {
    const user = await User.findOne({ rollNo: req.params.rollNo });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ solvedProblems: user.solvedProblems });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
});

module.exports = router;
