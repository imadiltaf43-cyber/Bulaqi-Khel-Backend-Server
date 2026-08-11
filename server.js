
const path = require("path");

const dotenv = require("dotenv");
const investorRoutes = require("./routes/investorRoutes");
const dashboardRoutes = require("./routes/DashboardRoutes");


const profileRoutes = require("./routes/profileRoutes");

// Load environment variables FIRST
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const mineralRoutes = require("./routes/mineralRoutes");

const employeeRoutes = require("./routes/employeeRoutes");

const projectRoutes = require("./routes/projectRoutes");

const jobRoutes = require("./routes/jobRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");

const contactRoutes = require("./routes/contactRoutes");


// website settings routes
const websiteSettingRoutes = require("./routes/websiteSettingRoutes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/minerals", mineralRoutes);
app.use("/api/profile", profileRoutes);

app.use("/api/employees", employeeRoutes);

app.use("/api/investors", investorRoutes);
app.use("/api/projects", projectRoutes);

app.use("/api/jobs", jobRoutes);
app.use("/api/job-applications", jobApplicationRoutes);

app.use("/api/contact", contactRoutes);

// website settings routes
app.use("/api/website-settings", websiteSettingRoutes);

app.use("/api/dashboard", dashboardRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("United Bulaqi Khel Enterprises API");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

console.log("Profile routes loaded");