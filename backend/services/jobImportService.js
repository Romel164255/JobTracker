const analyzeJob = require("./jobService");
const scrapeAllJobs = require("../scrapers/index");
const logger = require("../utils/logger");

async function importJobs() {
  try {
    const TARGET_SUITABLE = 10;
    let suitableFound = 0;
    let processed = 0;
    let storedCount = 0;
    let skippedInDbCount = 0;
    let applyCount = 0;
    let skipCount = 0;

    logger.info("Import started");
    logger.info("Scraping jobs from Naukri, Wellfound, LinkedIn");

    const jobs = await scrapeAllJobs();
    const totalFound = jobs.length;

    logger.info(`Total jobs scraped: ${totalFound}`);

    if (jobs.length === 0) {
      logger.warn("No jobs scraped. Check scraper logs above.");
      logger.success("Task complete");
      return {
        totalScraped: 0,
        processed: 0,
        applyCount: 0,
        skipCount: 0,
        storedCount: 0,
        dbSkippedCount: 0,
        suitableFound: 0
      };
    }

    for (const job of jobs) {
      processed++;
      logger.info(`Checking job ${processed}/${jobs.length}`);

      if (suitableFound >= TARGET_SUITABLE) {
        logger.info(`Target reached: ${suitableFound}/${TARGET_SUITABLE} suitable jobs`);
        break;
      }

      const result = await analyzeJob(job.jobText);
      const company = result.jobInfo.company || job.company || "Unknown";
      const role = result.jobInfo.role || "Unknown";
      const source = job.source || "unknown";
      const decision = result.summary.decision;
      const dbStatus = result.storage?.status || "unknown";

      if (result.apply) {
        suitableFound++;
        applyCount++;
      } else {
        skipCount++;
      }

      if (dbStatus === "stored") {
        storedCount++;
      } else if (dbStatus === "duplicate") {
        skippedInDbCount++;
      }

      logger.info(
        `Job result -> ${company} | ${role} | source=${source} | score=${result.score} | decision=${decision} | db=${dbStatus}`
      );
      logger.info(`Reason -> ${result.reason}`);
      logger.info(`Suitable jobs progress -> ${suitableFound}/${TARGET_SUITABLE}`);
    }

    logger.success("Task complete");
    logger.info(`Summary: scraped=${totalFound}, processed=${processed}`);
    logger.info(`Summary: apply=${applyCount}, skip=${skipCount}`);
    logger.info(`Summary: dbStored=${storedCount}, dbSkipped=${skippedInDbCount}`);
    logger.info(`Summary: suitableFound=${suitableFound}`);

    return {
      totalScraped: totalFound,
      processed,
      applyCount,
      skipCount,
      storedCount,
      dbSkippedCount: skippedInDbCount,
      suitableFound
    };
  } catch (error) {
    logger.error("Import error", error);
    throw error;
  }
}

module.exports = importJobs;
