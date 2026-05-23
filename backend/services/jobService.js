const profile = require("../utils/profile");
const matchJob = require("../parsers/matcher");
const extractExperience = require("../parsers/experienceParser");
const detectFlags = require("../parsers/jobFlags");
const createSummary = require("../parsers/jobSummary");
const extractJobInfo = require("../parsers/jobInfoParser");
const saveJob = require("./jobStorageService");
const analyzeJobAI = require("./geminiService");

async function analyzeJob(jobText) {
  const result = matchJob(jobText, profile);

  const aiResult = await analyzeJobAI(jobText);
  result.ai = aiResult;

  const experience = extractExperience(jobText);
  const flags = detectFlags(jobText);
  const jobInfo = extractJobInfo(jobText);

  result.flags = flags;
  result.experience = experience;
  result.jobInfo = jobInfo;

  result.apply = false;
  result.reason = "Low match score";

  if (experience && experience.minYears > 2) {
    result.reason = "Experience requirement too high";
  }

  if (flags.length > 0) {
    result.reason = flags.join(", ");
  }

  const canApply =
    result.score >= 50 &&
    flags.length === 0 &&
    (!experience || experience.minYears <= 2);

  if (canApply) {
    result.apply = true;
    result.reason = "Good match";
  }

  result.summary = createSummary(result);
  result.storage = await saveJob(result, jobText);

  return result;
}

module.exports = analyzeJob;
