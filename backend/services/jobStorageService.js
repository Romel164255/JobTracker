const pool = require("../db/db");
const generateJobHash = require("../utils/hashJob");
const logger = require("../utils/logger");

async function saveJob(result, jobText) {
  try {
    const company = result.jobInfo.company || "Unknown";
    const role = result.jobInfo.role || "Unknown";
    const location = result.jobInfo.location || "Unknown";
    const workMode = result.jobInfo.workMode || "Unknown";
    const decision = result.summary.decision;

    const hash = generateJobHash(company, role, location, jobText);

    const queryResult = await pool.query(
      `
INSERT INTO jobs(
company,
role,
location,
work_mode,
score,
decision,
reason,
matched_skills,
missing_skills,
flags,
job_hash,
job_url,
raw_text
)
VALUES(
$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
)
ON CONFLICT(job_url)
DO NOTHING
RETURNING id
`,
      [
        company,
        role,
        location,
        workMode,
        result.score,
        decision,
        result.reason,
        result.matched,
        result.missing,
        result.flags,
        hash,
        result.jobInfo.url,
        jobText
      ]
    );

    if (queryResult.rowCount === 0) {
      logger.warn(`DB skipped duplicate job: ${company} | ${role} | decision=${decision}`);
      return { stored: false, status: "duplicate" };
    }

    logger.success(`DB stored job: ${company} | ${role} | decision=${decision}`);
    return { stored: true, status: "stored" };
  } catch (error) {
    logger.error("Save job error", error);
    return { stored: false, status: "error" };
  }
}

module.exports = saveJob;
