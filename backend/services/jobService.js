const profile =
require("../utils/profile");

const matchJob =
require("../parsers/matcher");

const extractExperience =
require("../parsers/experienceParser");

const detectFlags =
require("../parsers/jobFlags");

const createSummary =
require("../parsers/jobSummary");

const extractJobInfo =
require("../parsers/jobInfoParser");

const saveJob =
require("./jobStorageService");

const analyzeJobAI =
require("./geminiService");


async function analyzeJob(jobText){

    // Skill matching
    const result =
    matchJob(
        jobText,
        profile
    );


    // AI analysis (Gemini)
    const aiResult =
    await analyzeJobAI(
        jobText
    );

    result.ai =
    aiResult;


    // Extract metadata
    const experience =
    extractExperience(
        jobText
    );

    const flags =
    detectFlags(
        jobText
    );

    const jobInfo =
    extractJobInfo(
        jobText
    );


    // Attach data
    result.flags =
    flags;

    result.experience =
    experience;

    result.jobInfo =
    jobInfo;


    // Defaults
    result.apply =
    false;

    result.reason =
    "Low match score";


    // Experience rule
    if(
        experience &&
        experience.minYears > 2
    ){

        result.reason =
        "Experience requirement too high";

    }


    // Red flags override
    if(
        flags.length > 0
    ){

        result.reason =
        flags.join(", ");

    }


    // Final decision
    const canApply =

        result.score >= 50 &&

        flags.length === 0 &&

        (
            !experience ||
            experience.minYears <= 2
        );


    if(canApply){

        result.apply =
        true;

        result.reason =
        "Good match";

    }


    // Generate summary
    result.summary =
    createSummary(
        result
    );


    // Save to DB
    await saveJob(
        result,
        jobText
    );


    return result;

}


module.exports =
analyzeJob;