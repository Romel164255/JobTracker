// backend/services/jobImportService.js
// CHANGED: replaced sampleJobs.js with real scraper (../scrapers/index.js)
// Everything else stays the same — scraper returns same { company, jobText } format.

const analyzeJob = require("./jobService");
const scrapeAllJobs = require("../scrapers/index");   // <-- THIS IS THE ONLY CHANGE

async function importJobs() {
  try {
    let found = 0;
    let processed = 0;

    console.log("Starting job import...");

    // Scrape live jobs from Naukri, Wellfound, LinkedIn
    const jobs = await scrapeAllJobs();

    if (jobs.length === 0) {
      console.log("No jobs scraped. Check scraper logs above.");
      return;
    }

    for (const job of jobs) {
      processed++;
      console.log(`\nChecking job ${processed} of ${jobs.length}`);

      // Stop after finding 10 suitable jobs
      if (found >= 10) {
        console.log("\nTarget reached");
        console.log(`Found ${found} suitable jobs`);
        break;
      }

      const result = await analyzeJob(job.jobText);

      console.log("Company:", result.jobInfo.company || job.company || "Unknown");
      console.log("Role:", result.jobInfo.role || "Unknown");
      console.log("Score:", result.score);
      console.log("Decision:", result.summary.decision);
      console.log("Reason:", result.reason);
      console.log("Source:", job.source || "unknown");

      if (result.apply) {
        found++;
        console.log(`Suitable jobs found: ${found}/10`);
      }
    }

    console.log("\nImport complete");
    console.log(`Jobs processed: ${processed}`);
    console.log(`Suitable jobs found: ${found}`);
  } catch (error) {
    console.log("Import error:");
    console.log(error);
  }
}

module.exports = importJobs;
