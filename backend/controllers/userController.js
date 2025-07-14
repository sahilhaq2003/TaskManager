const Task = require("../models/Task");
const User = require("../models/User");

// @desc    Get all users (Admin only)
// @route   GET /api/user/
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({role:"member"}).select("-password");
        //Add task counts to each user
        const usersWithTaskCounts = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
            const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "In Progress" });
            const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completed" });
            return{
                ...user._doc, //include all existing user data
                pendingTasks,
                inProgressTasks,
                completedTasks,
            }
        }
    ));
    res.json(usersWithTaskCounts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/user/:id
// @access  Private (Any logged-in user)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete a user (Admin only)
// @route   DELETE /api/user/:id
// @access  Private (Admin)

/*
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: Delete tasks or other related data
    // await Task.deleteMany({ assignedTo: user._id });

    await user.deleteOne();
    res.json({ message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
*/
//module.exports = { getUsers, getUserById, deleteUser };

module.exports = { getUsers, getUserById};

