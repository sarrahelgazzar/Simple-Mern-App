const mongoose = require("mongoose");
const UserModel = require("./Users"); 

const goalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true }, 
    text: { type: String, required: true },
    category: { 
      type: String, 
      enum: ["Health", "Career", "Education", "Finance", "Personal"], 
      default: "Personal" 
    },
    priority: { 
      type: String, 
      enum: ["Low", "Medium", "High"], 
      default: "Medium" 
    },
    deadline: { type: Date },
    isFavorite: { type: Boolean, default: false },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true } 
);

const GoalModel = mongoose.model("GoalModel", goalSchema);
module.exports = GoalModel;
