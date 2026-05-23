// backend/scrapers/index.js

// Runs all scrapers in parallel
// Combines results
// Removes duplicates
// Returns final job list

const scrapeNaukri =
require("./naukri");

const scrapeWellfound =
require("./wellfound");

const scrapeLinkedIn =
require("./linkedin");


// Enable / disable sources

const SOURCES = {

naukri:true,

wellfound:true,

linkedin:false

};


async function scrapeAllJobs(){

console.log(
"\n========== JOB SCRAPER STARTED =========="
);

const tasks=[];


// Naukri

if(SOURCES.naukri){

tasks.push(

scrapeNaukri()

.catch(error=>{

console.error(

"[Scraper] Naukri failed:",

error.message

);

return [];

})

);

}


// Wellfound

if(SOURCES.wellfound){

tasks.push(

scrapeWellfound()

.catch(error=>{

console.error(

"[Scraper] Wellfound failed:",

error.message

);

return [];

})

);

}


// LinkedIn

if(SOURCES.linkedin){

tasks.push(

scrapeLinkedIn()

.catch(error=>{

console.error(

"[Scraper] LinkedIn failed:",

error.message

);

return [];

})

);

}


// Run all scrapers together

const results=

await Promise.all(
tasks
);


// Merge arrays

const combined=

results.flat();


// Deduplicate jobs

const seen=
new Set();

const unique=

combined.filter(job=>{

const dedupeKey=

`${

job.jobUrl ||

job.company ||

"unknown"

}-${

(job.jobText || "")

.slice(0,60)

}`

.toLowerCase()

.replace(/\s+/g," ")

.trim();


if(
seen.has(
dedupeKey
)
){

return false;

}

seen.add(
dedupeKey
);

return true;

});



console.log(
"\n========== SCRAPING COMPLETE =========="
);

console.log(

`Total raw jobs: ${combined.length}`

);

console.log(

`After dedup: ${unique.length}`

);

console.log(
"\nSources breakdown:"
);


// Dynamic indexing

let sourceIndex=0;


if(SOURCES.naukri){

console.log(

`Naukri: ${

results[sourceIndex++]?.length ?? 0

}`

);

}


if(SOURCES.wellfound){

console.log(

`Wellfound: ${

results[sourceIndex++]?.length ?? 0

}`

);

}


if(SOURCES.linkedin){

console.log(

`LinkedIn: ${

results[sourceIndex++]?.length ?? 0

}`

);

}


console.log(
"=======================================\n"
);


return unique;

}


module.exports=
scrapeAllJobs;