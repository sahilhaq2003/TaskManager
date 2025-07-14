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
     try{

    }catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
 
}



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

    }catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

//@desc Delete a task (Admin)
//@route DELETE /api/tasks/:id
//@access Private (Admin)

const deleteTask = async (req, res) => {
    try{

    }catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


//@desc Update task status (Admin: all, User: assigned)
//@route PUT /api/tasks/:id/status
//@access Private (Admin: all, User: assigned)

const updateTaskStatus = async (req, res) => {
    try{

    }catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


//@desc Update task checklist (Admin: all, User: assigned)
//@route PUT /api/tasks/:id/todo
//@access Private (Admin: all, User: assigned)

const updateTaskChecklist = async (req, res) => {
    try{

    }catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

//@desc Get dashboard data (Admin)
//@route GET /api/tasks/dashboard-data
const getDashboardData = async (req, res) => {
    try{

    }catch (error) {
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