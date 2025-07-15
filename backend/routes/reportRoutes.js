const exprepess = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const { exportTasksReport, exportUsersReport } = require("../controllers/reportController");

const router = exprepess.Router();

router.get("/export/tasks",protect,adminOnly,exportTasksReport);
router.get("/export/users",protect,adminOnly,exportUsersReport); 

module.exports = router;


