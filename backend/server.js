const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const model = require("./user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected successfully! ✅"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/api/register", async (req, res) => {
  const newPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const user = await model.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });

    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "Duplicate Email" });
  }
});

app.post("/api/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await model.findOne({ email: email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      { email: user.email, name: user.name },
      process.env.JWT_SECRET
    );
    
    res.json({ status: "ok", token: token });
  } else {
    res.json({ status: "Wrong Email or Password" });
  }
});

app.post("/api/dashboard", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const isTokenValid = jwt.verify(token, process.env.JWT_SECRET);
    const email = isTokenValid.email;
    await model.updateOne({ email: email }, { $set: { goal: req.body.tempGoal } });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "Invalid Token" });
  }
});

app.get("/api/dashboard", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const isValidToken = jwt.verify(token, process.env.JWT_SECRET);
    const email = isValidToken.email;
    const user = await model.findOne({ email: email });
    res.json({ status: "ok", goal: user.goal });
  } catch (err) {
    res.json("Invalid Token");
  }
});

const PORT = process.env.PORT || 1337;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));