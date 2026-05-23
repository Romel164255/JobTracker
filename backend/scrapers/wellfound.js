// backend/scrapers/wellfound.js

const {
  getBrowser
} = require(
  "../services/browserService"
);

const WELLFOUND_SEARCHES = [

  // Hyderabad
  "https://wellfound.com/jobs?role=full-stack-engineer&location=hyderabad-india",

  "https://wellfound.com/jobs?role=backend-engineer&location=hyderabad-india",

  "https://wellfound.com/jobs?role=software-engineer&location=hyderabad-india&remote=true",

  // Bengaluru
  "https://wellfound.com/jobs?role=backend-engineer&location=bengaluru-india",

  "https://wellfound.com/jobs?role=software-engineer&location=bengaluru-india",

  // Chennai
  "https://wellfound.com/jobs?role=backend-engineer&location=chennai-india",

  // Remote
  "https://wellfound.com/jobs?role=full-stack-engineer&remote=true"

];

const MAX_JOBS_PER_URL = 3;


async function scrapeWellfound(){

const browser =
await getBrowser();

const context =
await browser.newContext({

userAgent:
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

});

const page =
await context.newPage();

await page.route(

"**/*.{png,jpg,jpeg,gif,svg,woff,woff2,ttf,mp4}",

route => route.abort()

);

const allJobs=[];

const seenKeys=
new Set();

try{

for(const url of WELLFOUND_SEARCHES){

console.log(

`[Wellfound] Searching: ${url}`

);

await page.goto(

url,

{

waitUntil:"networkidle",

timeout:35000

}

);

await page.waitForTimeout(
2500
);


const jobs=

await page.evaluate(

(maxJobs)=>{

const results=[];

const cards=

document.querySelectorAll(

"[data-test='StartupResult'], div[class*='JobListing'], div[class*='job'], article, li"

);

let count=0;

for(const card of cards){

if(count>=maxJobs){

break;

}

const companySelector=

"h2, [class*='company'], [class*='startup']";

const titleSelector=

"h3, [class*='title'], [class*='role']";


const company=

card.querySelector(

companySelector

)

?.innerText

?.trim();


const title=

card.querySelector(

titleSelector

)

?.innerText

?.trim();


const link=

card.querySelector(
"a"
)

?.href;


const description=

card.innerText

?.trim()

|| "";


if(

company &&
title

){

results.push({

company,
title,
link,
description

});

count++;

}

}

return results;

},

MAX_JOBS_PER_URL

);


for(const job of jobs){

const key=

`${job.title}-${job.company}`

.toLowerCase()

.trim();

if(
seenKeys.has(key)
)

continue;

seenKeys.add(
key
);

const jobText=[

`Company:${job.company}`,

`Role:${job.title}`,

`Description:${job.description}`,

`Source:Wellfound`

]

.filter(Boolean)

.join("\n");


allJobs.push({

company:
job.company,

jobUrl:
job.link,

jobText,

source:
"wellfound"

});

}

await page.waitForTimeout(
2500
);

}

}
catch(error){

console.log(

`[Wellfound] ${error.message}`

);

}

await context.close();

console.log(

`[Wellfound] Scraped ${allJobs.length} jobs`

);

return allJobs;

}

module.exports=
scrapeWellfound;