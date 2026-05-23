const express = require("express");
const importJobs = require("../services/jobImportService");
const logger = require("../utils/logger");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    logger.info("Import API called: POST /api/import");
    const summary = await importJobs();

    res.json({
      message: "Import task complete",
      summary
    });
  } catch (error) {
    logger.error("Import failed", error);

    res.status(500).json({
      message: "Import failed"
    });
  }
});

module.exports = router;
