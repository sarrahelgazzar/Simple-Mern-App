const express = require("express");
const jwt = require("jsonwebtoken");


const GoalModel = require("../models/Goals"); // Adjust path if needed

const router = express.Router();


const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) return res.status(403).json({ message: "Access denied, no token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};


router.post("/addGoal", verifyToken, async (req, res) => {
  try {
    const { text, category, priority, deadline } = req.body;

    const newGoal = new GoalModel({
      userId: req.userId,
      text,
      category,
      priority,
      deadline,
    });

    await newGoal.save();
    res.status(201).json({ message: "Goal added", goal: newGoal });
  } catch (error) {
    res.status(500).json({ message: "Error adding goal",error: error.message });
  }
});

//Get All Goals for User
router.get("/", verifyToken, async (req, res) => {
  try {
    const goals = await GoalModel.find({ userId: req.userId });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching goals", error });
  }
});

// ✅ Update Goal
router.put("/update/:goalId", verifyToken, async (req, res) => {
  try {
    const { goalId } = req.params;
    const updatedGoal = await GoalModel.findOneAndUpdate(
      { _id: goalId, userId: req.userId }, // Ensure user can only update their own goal
      req.body,
      { new: true }
    );

    if (!updatedGoal) return res.status(404).json({ message: "Goal not found" });

    res.status(200).json({ message: "Goal updated", goal: updatedGoal });
  } catch (error) {
    res.status(500).json({ message: "Error updating goal", error });
  }
});

// 
router.delete("/delete/:goalId", verifyToken, async (req, res) => {
  try {
    const { goalId } = req.params;
    const deletedGoal = await GoalModel.findOneAndDelete({ _id: goalId, userId: req.userId });

    if (!deletedGoal) return res.status(404).json({ message: "Goal not found" });

    res.status(200).json({ message: "Goal deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting goal", error });
  }
});

// ✅ Mark Goal as Favorite
router.put("/favorite/:goalId", verifyToken, async (req, res) => {
  try {
    const { goalId } = req.params;

    const goal = await GoalModel.findOne({ _id: goalId, userId: req.userId });
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    goal.isFavorite = !goal.isFavorite; // Toggle favorite status
    await goal.save();

    res.status(200).json({ message: "Goal favorite status updated", goal });
  } catch (error) {
    res.status(500).json({ message: "Error updating favorite status", error });
  }
});

// ✅ Get Favorite Goals
router.get("/favorites", verifyToken, async (req, res) => {
  try {
    const favoriteGoals = await GoalModel.find({ userId: req.userId, isFavorite: true });
    res.status(200).json(favoriteGoals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorite goals", error });
  }
});

module.exports = router;
