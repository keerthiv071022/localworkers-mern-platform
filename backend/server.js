
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const workerRoutes = require("./routes/workerRoutes");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const savedWorkerRoutes = require("./routes/savedWorkerRoutes");

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  })
);

// Middleware
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/requests", serviceRequestRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/saved-workers", savedWorkerRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "LocalWorkers API is running successfully",
  });
});

// Server configuration
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `LocalWorkers backend running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
