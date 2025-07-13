const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getUsers,
  getUserById,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

//  GET all users (Admin only)
router.get("/", protect, adminOnly, getUsers);

// GET specific user by ID (Any logged-in user)
router.get("/:id", protect, getUserById);

// DELETE a user (Admin only)
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
