// backend/scrapers/index.js
// Runs all scrapers in parallel and returns combined, deduplicated job list.
// Replace the old sampleJobs.js import in jobImportService.js with this.

const scrapeNaukri = require("./naukri");
const scrapeWellfound = require("./wellfound");
const scrapeLinkedIn = require("./linkedin");

// Which sources to run — set to false to disable any
const SOURCES = {
  naukri: true,
  wellfound: true,
  linkedin: false,
};

async function scrapeAllJobs() {
  console.log("\n========== JOB SCRAPER STARTED ==========");

  const tasks = [];

  if (SOURCES.naukri) tasks.push(scrapeNaukri().catch((e) => {
    console.error("[Scraper] Naukri failed:", e.message);
    return [];
  }));

  if (SOURCES.wellfound) tasks.push(scrapeWellfound().catch((e) => {
    console.error("[Scraper] Wellfound failed:", e.message);
    return [];
  }));

  if (SOURCES.linkedin) tasks.push(scrapeLinkedIn().catch((e) => {
    console.error("[Scraper] LinkedIn failed:", e.message);
    return [];
  }));

  // Run all scrapers concurrently
  const results = await Promise.all(tasks);
  const combined = results.flat();

  // Deduplicate by company + rough title match
  const seen = new Set();
  const unique = combined.filter((job) => {
    const key = `${job.company}-${job.jobText.slice(0, 60)}`.toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`\n========== SCRAPING COMPLETE ==========`);
  console.log(`Total raw jobs:  ${combined.length}`);
  console.log(`After dedup:     ${unique.length}`);
  console.log(`Sources breakdown:`);
  if (SOURCES.naukri)    console.log(`  Naukri:    ${results[0]?.length ?? 0}`);
  if (SOURCES.wellfound) console.log(`  Wellfound: ${results[1]?.length ?? 0}`);
  if (SOURCES.linkedin)  console.log(`  LinkedIn:  ${results[2]?.length ?? 0}`);
  console.log(`=======================================\n`);

  return unique;
}

module.exports = scrapeAllJobs;
