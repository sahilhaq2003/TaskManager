const Task = require("../models/Task");
const { create } = require("../models/User");


//@desc Get all tasks (Admin: all, User: assigned)
//@route GET /api/tasks
//@access Private (Admin: all, User: assigned)

const getTask = async (req, res) => {
       try{
        const {status} = req.query;
        let filter ={};

        if (status){
            filter.status = status;
        }

        let tasks;
        if(req.user.role === "admin") {
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        }else{
            tasks = await Task.find({...filter, assignedTo: req.user._id}).populate( 
                assignedTo,
                "name email profileImageUrl"
            );
        }

        //Add completed todoChecklist count to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter(
                    (item) => item.completed
                ).length;

                return {
                    ...task._doc,
                    completedTodoCount: completedCount,
                };
            })
        );

        //status summary counts

        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id },
        );

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "pending", 
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });
        
        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "in progress",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const completedTasks = await Task.countDocuments({
            ...filter,  
            status: "completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        res.status(200).json({
            message: "Tasks fetched successfully",
            tasks,
            summary: {
                all:allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            },
        });
        
    }catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

}


//@desc Get task by ID (Admin: all, User: assigned)
//@route GET /api/tasks/:id 
//@access Private (Admin: all, User: assigned)

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(task); 
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



//@desc Create a new task (Admin)
//@route POST /api/tasks
//@access Private (Admin)

const createTask = async (req, res) => {
    try{
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist,
        } = req.body;

        if (!Array.isArray(assignedTo)){
            return res
            .status(400)
            .json({ message: "AssignedTo must be an array of user IDs" });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id, // Assuming req.user is set by auth middleware
            todoChecklist,
            attachments,
        });

        res.status(201).json({
            message: "Task created successfully",
            task,
        });

    }catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


//@desc Update a task (Admin)
//@route PUT /api/tasks/:id
//@access Private (Admin)

const updateTask = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;

        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: "AssignedTo must be an array of user IDs" });
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updatedTask = await task.save();
        res.json({ message: "Task updated successfully",updatedTask });

    }catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

//@desc Delete a task (Admin)
//@route DELETE /api/tasks/:id
//@access Private (Admin)

const deleteTask = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.deleteOne();
        res.json({ message: "Task deleted successfully" });

    }catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


//@desc Update task status (Admin: all, User: assigned)
//@route PUT /api/tasks/:id/status
//@access Private (Admin: all, User: assigned)

const updateTaskStatus = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        const  isAssigned =task.assignedTo.some(
            (userId)=> userId.toString() === req.user._id.toString()
        );

        if(!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to update this task" });
        }
        task.status = req.body.status || task.status;

        if (task.status === "completed"){
            task.todoChecklist.forEach((item)=>(item.completed = true));
            task.progress = 100;
        }

        await task.save();
        res.json({ message: "Task status updated successfully", task });

    }catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


//@desc Update task checklist (Admin: all, User: assigned)
//@route PUT /api/tasks/:id/todo
//@access Private (Admin: all, User: assigned)

const updateTaskChecklist = async (req, res) => {
    try{
        const {todoChecklist} = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        if(!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
            return res.status(403)
            .json({ message: "You are not authorized to update this task" });
        }

        task.todoChecklist = todoChecklist; //Replace with updated checklist

        //Auto-update progress based on completed items
        const completedCount = todoChecklist.filter(item => item.completed).length;
        const totalItems = task.todoChecklist.length;
        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

        //Auto-mark task as completed if all items are done
        if (task.progress === 100) {
            task.status = "Completed";
        }else if(task.progress > 0) {
            task.status = "In progress";
        }else{
            task.status = "Pending";
        }

        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );
        res.json({ message: "Task checklist updated successfully", task:updatedTask });


    }catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

//@desc Get dashboard data (Admin)
//@route GET /api/tasks/dashboard-data
//1.23.31
const getDashboardData = async (req, res) => {
    try {
        // Fetch statistics for admin dashboard
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: "Pending" });
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const inProgressTasks = await Task.countDocuments({ status: "In progress" });
        const overdueTasks = await Task.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: "Completed" },
        });

        // Ensure all possible statuses are included
        const taskStatuses = ["Pending", "In progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "_");
            acc[formattedKey] = taskDistributionRaw.find(
                (item) => item._id === status
            )?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;

        // Ensure all priorities are included
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelsRaw.find(item => item._id === priority)?.count || 0;
            return acc;
        }, {});

        // Fetch recent 10 tasks
        const recentTasks = await Task.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate assignedTo createdAt");

        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                inProgressTasks,
                overdueTasks,
            },

            charts: {
                taskDistribution,
                taskPriorityLevels,
            },

            recentTasks,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


//@desc Get user dashboard data (User)
//@route GET /api/tasks/user-dashboard-data
//@access Private (User)

const getUserDashboardData = async (req, res) => {
    try{

    }catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    getTask,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData,
};