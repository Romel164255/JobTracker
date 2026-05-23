const pool =
require("../db/db");

const generateJobHash =
require("../utils/hashJob");


async function saveJob(

    result,
    jobText

){

try{

    const company =

    result.jobInfo.company ||

    "Unknown";


    const role =

    result.jobInfo.role ||

    "Unknown";


    const location =

    result.jobInfo.location ||

    "Unknown";


    const workMode =

    result.jobInfo.workMode ||

    "Unknown";



    const hash =

    generateJobHash(

        company,
        role,
        location,
        jobText

    );



await pool.query(

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
`,
[
company,
role,
location,
workMode,
result.score,
result.summary.decision,
result.reason,
result.matched,
result.missing,
result.flags,
hash,
result.jobInfo.url,
jobText
]

);


console.log(
"Job saved"
);

}
catch(error){

console.log(
"Save job error:"
);

console.log(
error
);

}

}


module.exports =
saveJob;