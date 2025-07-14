const express = require("express");


const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { getDashboardData, getUserDashboardData, getTask, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist } = require("../controllers/taskController");


const router = express.Router();

//Task Management Routes
router.get("/dashboard-data", protect,getDashboardData);
router.get("/user-dashboard-data",protect,getUserDashboardData);
router.get("/",protect,getTask); //get all tasks (Admin:all User :assigned)
router.get("/:id",protect,getTaskById); //get task by id (Admin:all User :assigned
router.post("/",protect,adminOnly,createTask); //create task (Admin
router.put("/:id",protect,adminOnly,updateTask); //update task (Admin
router.delete("/:id",protect,adminOnly,deleteTask); //delete task (Admin)
router.put("/:id/status",protect,updateTaskStatus); //update task status (Admin:all User :assigned)
router.put("/id/todo",protect,updateTaskChecklist); //update task todo (Admin:all User :assigned)


module.exports = router;

