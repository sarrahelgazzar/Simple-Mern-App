const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const authRoutes = require("./routes/auth");
const goalRoutes = require("./routes/goals");

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));


app.use("/api", authRoutes);
app.use("/api", goalRoutes);


app.use(express.static(path.join(__dirname, "build"))); 

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


const PORT = process.env.PORT || 1337;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
