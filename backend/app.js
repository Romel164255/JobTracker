const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const jobRoutes = require("./routes/jobRoutes");
const jobListRoutes = require("./routes/jobListRoutes");
const importRoutes = require("./routes/importRoutes");

app.use("/api/jobs", jobRoutes);
app.use("/api/job-list", jobListRoutes);
app.use("/api/import", importRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.success(`API connected. Server running on port ${PORT}`);
  logger.info("Routes ready: /api/jobs, /api/job-list, /api/import");
});
