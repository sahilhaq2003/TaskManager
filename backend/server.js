require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes"); 
// const userRoutes = require("./routes/userRoutes"); // If routes are merged, you can skip this

const app = express();

// Connect Database
connectDB();



// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON Parser
app.use(express.json());

// Serve static files from /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/tasks", taskRoutes);




// app.use("/api/user", userRoutes); // Optional: use if userRoutes is separate

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
