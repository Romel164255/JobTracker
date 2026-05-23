const analyzeJob =
require("./jobService");

const jobs =
require("../scrapers/sampleJobs");


async function importJobs(){

try{

let found = 0;
let processed = 0;

console.log(
"Starting job import..."
);

for(const job of jobs){

processed++;

console.log(
`\nChecking job ${processed}`
);


// Stop after finding 10 suitable jobs
if(found >= 10){

console.log(
"\nTarget reached"
);

console.log(
`Found ${found} suitable jobs`
);

break;

}


const result =

await analyzeJob(
job.jobText
);


console.log(
"Company:",
result.jobInfo.company ||
"Unknown"
);

console.log(
"Role:",
result.jobInfo.role ||
"Unknown"
);

console.log(
"Score:",
result.score
);

console.log(
"Decision:",
result.summary.decision
);

console.log(
"Reason:",
result.reason
);


// Increase only if APPLY
if(result.apply){

found++;

console.log(
`Suitable jobs found: ${found}/10`
);

}

}


console.log(
"\nImport complete"
);

console.log(
`Jobs processed: ${processed}`
);

console.log(
`Suitable jobs found: ${found}`
);

}
catch(error){

console.log(
"Import error:"
);

console.log(
error
);

}

}


module.exports =
importJobs;