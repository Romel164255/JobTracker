const analyzeJob =
require("./jobService");

const jobs =
require("../scrapers/sampleJobs");


async function importJobs(){

try{

for(const job of jobs){

await analyzeJob(
job.jobText
);

}

console.log(
"Import complete"
);

}
catch(error){

console.log(
error
);

}

}

module.exports =
importJobs;