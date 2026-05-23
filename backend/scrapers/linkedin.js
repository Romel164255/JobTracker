// backend/scrapers/linkedin.js

const { getBrowser } =
require("../services/browserService");

const LINKEDIN_SEARCHES = [

  // Hyderabad
  "https://www.linkedin.com/jobs/search/?keywords=junior%20node.js%20developer&location=Hyderabad%2C%20India&f_E=2&f_TPR=r604800",

  "https://www.linkedin.com/jobs/search/?keywords=junior%20react%20developer&location=Hyderabad%2C%20India&f_E=2&f_TPR=r604800",

  "https://www.linkedin.com/jobs/search/?keywords=junior%20full%20stack%20developer&location=Hyderabad%2C%20India&f_E=2",


  // Bengaluru
  "https://www.linkedin.com/jobs/search/?keywords=junior%20node.js%20developer&location=Bengaluru%2C%20India&f_E=2&f_TPR=r604800",

  "https://www.linkedin.com/jobs/search/?keywords=junior%20react%20developer&location=Bengaluru%2C%20India&f_E=2&f_TPR=r604800",

  "https://www.linkedin.com/jobs/search/?keywords=junior%20full%20stack%20developer&location=Bengaluru%2C%20India&f_E=2",


  // Chennai
  "https://www.linkedin.com/jobs/search/?keywords=junior%20node.js%20developer&location=Chennai%2C%20India&f_E=2&f_TPR=r604800",

  "https://www.linkedin.com/jobs/search/?keywords=junior%20react%20developer&location=Chennai%2C%20India&f_E=2&f_TPR=r604800",

  "https://www.linkedin.com/jobs/search/?keywords=junior%20full%20stack%20developer&location=Chennai%2C%20India&f_E=2",


  // Remote India
  "https://www.linkedin.com/jobs/search/?keywords=junior%20backend%20developer&location=India&f_E=2&f_WT=2",

  "https://www.linkedin.com/jobs/search/?keywords=junior%20full%20stack%20developer&location=India&f_E=2&f_WT=2"

];

const MAX_JOBS_PER_SEARCH = 3;

async function scrapeLinkedIn(){

const browser =
await getBrowser();

const context =
await browser.newContext({

userAgent:
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",

viewport:{
width:1366,
height:768
},

extraHTTPHeaders:{

"Accept-Language":
"en-US,en;q=0.9"

}

});

const page =
await context.newPage();

await page.route(

"**/{ads,analytics,tracking,telemetry}**",

route=>route.abort()

);

await page.route(

"**/*.{png,jpg,jpeg,gif,svg,woff,woff2,ttf}",

route=>route.abort()

);

const allJobs=[];

const seenIds=
new Set();

for(const searchUrl of LINKEDIN_SEARCHES){

try{

console.log(
`[LinkedIn] ${searchUrl}`
);

await page.goto(

searchUrl,

{
waitUntil:"domcontentloaded",
timeout:30000
}

);

const hasSignInWall =

await page
.locator(
".authwall-join-form,.join-form"
)
.count()
.then(c=>c>0)
.catch(()=>false);

if(hasSignInWall){

console.log(
"[LinkedIn] Sign-in wall detected"
);

continue;

}

await page

.waitForSelector(

".jobs-search__results-list li,.base-card",

{
timeout:12000
}

)

.catch(()=>null);

await page.waitForTimeout(
2000
);

const jobs=

await page.evaluate(

(max)=>{

const results=[];

const cards=

document.querySelectorAll(

".jobs-search__results-list li,.base-search-card"

);

let count=0;

for(const card of cards){

if(count>=max){

break;

}

const title=

card.querySelector(
".base-search-card__title"
)
?.innerText
?.trim();

const company=

card.querySelector(
".base-search-card__subtitle"
)
?.innerText
?.trim();

const location=

card.querySelector(
".job-search-card__location"
)
?.innerText
?.trim()

|| "India";

const jobUrl=

card.querySelector(
"a.base-card__full-link"
)
?.href;

if(title && company){

results.push({

title,
company,
location,
jobUrl

});

count++;

}

}

return results;

},

MAX_JOBS_PER_SEARCH

);

for(const job of jobs){

const key=

`${job.title}-${job.company}`
.toLowerCase();

if(seenIds.has(key))
continue;

seenIds.add(key);

const jobText=[

`Company:${job.company}`,

`Role:${job.title}`,

`Location:${job.location}`,

`Experience:0-2 years`,

`Source:LinkedIn`

]

.join("\n");

allJobs.push({

company:
job.company,

jobUrl:
job.jobUrl,

jobText,

source:
"linkedin"

});

}

await page.waitForTimeout(
5000
);

}
catch(err){

console.error(
`[LinkedIn] ${err.message}`
);

}

}

await context.close();

console.log(
`[LinkedIn] Scraped ${allJobs.length}`
);

return allJobs;

}

module.exports =
scrapeLinkedIn;