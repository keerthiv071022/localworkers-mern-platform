const dns = require("node:dns");
const authRoutes = require("./routes/authRoutes");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const workerRoutes = require("./routes/workerRoutes");
const connectDB = require("./config/db");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/requests", serviceRequestRoutes);
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/saved-workers", require("./routes/savedWorkerRoutes"));
app.get("/", (req, res) => {
  res.json({
    message: "LocalWorkers API is running successfully",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`LocalWorkers backend running on port ${PORT}`);
  });
};

startServer();
