const express = require("express");
const { registerUser, loginuser, logOutUser, getCurrentUser } = require("../controllers/AuthController");
const { verifyJWT } = require("../middleware/Auth");
const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.send("Auth route working");
});

// Authentication routes
router.post("/register", registerUser);
router.post("/login", loginuser);
router.post("/logout", verifyJWT, logOutUser);
router.get("/me", verifyJWT, getCurrentUser);

module.exports = router;