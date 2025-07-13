const express = require("express");
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile 
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { getUsers } = require("../controllers/userController");

const router = express.Router();

// Auth routes
router.post("/register", registerUser); // Register User
router.post("/login", loginUser);       // Login User
router.get("/profile", protect, getUserProfile);   // Get user profile
router.put("/profile", protect, updateUserProfile); // Update user profile

// Admin-only route to get all users
router.get("/users", protect, adminOnly, getUsers); // ✅ Fixed 'router'

// Image upload route
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

module.exports = router;
