// backend/scrapers/naukri.js
// Scrapes Naukri.com for junior developer jobs
// Updated selectors only; architecture unchanged

const { getBrowser } =
require("../services/browserService");

const SEARCH_QUERIES = [

  // Hyderabad
  { keyword:"node js developer", location:"hyderabad" },
  { keyword:"react developer fresher", location:"hyderabad" },
  { keyword:"full stack developer junior", location:"hyderabad" },
  { keyword:"backend developer javascript", location:"hyderabad" },

  // Bengaluru
  { keyword:"node js developer", location:"bengaluru" },
  { keyword:"react developer fresher", location:"bengaluru" },
  { keyword:"full stack developer junior", location:"bengaluru" },
  { keyword:"backend developer javascript", location:"bengaluru" },

  // Chennai
  { keyword:"node js developer", location:"chennai" },
  { keyword:"react developer fresher", location:"chennai" },
  { keyword:"full stack developer junior", location:"chennai" },
  { keyword:"backend developer javascript", location:"chennai" },

  // Remote India
  { keyword:"node js developer", location:"india" },
  { keyword:"full stack developer remote", location:"india" }

];

const MAX_JOBS_PER_QUERY = 3;


function buildNaukriURL(
keyword,
location
){

const k=
encodeURIComponent(
keyword
);

const l=
encodeURIComponent(
location
);

return `https://www.naukri.com/${
keyword.replace(/\s+/g,"-")
}-jobs-in-${location}?k=${k}&l=${l}&experience=0`;

}


async function scrapeNaukri(){

const browser=
await getBrowser();

const context=
await browser.newContext({

userAgent:
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",

viewport:{

width:1280,
height:800

}

});

const page=
await context.newPage();

await page.route(

"**/*.{png,jpg,jpeg,gif,svg,woff,woff2,ttf}",

route=>route.abort()

);

const allJobs=[];

const seenTitles=
new Set();

for(const query of SEARCH_QUERIES){

try{

console.log(

`[Naukri] Searching: ${query.keyword}`

);

const url=

buildNaukriURL(

query.keyword,
query.location

);

await page.goto(

url,

{

waitUntil:"domcontentloaded",
timeout:30000

}

);

await page.waitForTimeout(
2500
);


// FIXED SELECTORS

const jobs=

await page.evaluate(

(maxJobs)=>{

const results=[];

const cards=

document.querySelectorAll(

`
.srp-jobtuple-wrapper,
article.jobTuple,
div[class*='cust-job-tuple'],
div[class*='jobTuple']
`

);

let count=0;

for(const card of cards){

if(count>=maxJobs){

break;

}

const titleEl=

card.querySelector(".title") ||

card.querySelector("a.title") ||

card.querySelector("[class*='title']") ||

card.querySelector("h2") ||

card.querySelector("a");


const companyEl=

card.querySelector(".comp-name") ||

card.querySelector(".subTitle") ||

card.querySelector("[class*='company']");


const locationEl=

card.querySelector(".locWdth") ||

card.querySelector(".location");


const expEl=

card.querySelector(".expwdth") ||

card.querySelector(".experience");


const skillsEl=

card.querySelector(".tags-gt") ||

card.querySelector(".skills");


const descEl=

card.querySelector(".job-desc") ||

card.querySelector(".job-description");


const linkEl=

card.querySelector(

"a.title,a[title],a"

);


const title=

titleEl?.innerText?.trim();

const company=

companyEl?.innerText?.trim();

const location=

locationEl?.innerText?.trim()

|| "India";


const experience=

expEl?.innerText?.trim()

|| "0-2 years";


const skills=

skillsEl?.innerText?.trim()

|| "";


const description=

descEl?.innerText?.trim()

|| "";


const jobLink=

linkEl?.href || null;


if(

title &&
company

){

results.push({

title,
company,
location,
experience,
skills,
description,
jobLink

});

count++;

}

}

return results;

},

MAX_JOBS_PER_QUERY

);


for(const job of jobs){

const key=

`${job.title}-${job.company}`

.toLowerCase();

if(
seenTitles.has(key)
)

continue;

seenTitles.add(
key
);

const workMode=

job.location
.toLowerCase()
.includes("remote")

?

"remote"

:

"on-site";


const jobText=[

`Company:${job.company}`,

`Role:${job.title}`,

`Location:${job.location}`,

`Work Mode:${workMode}`,

`Experience:${job.experience}`,

`Skills Required:${job.skills}`,

`Description:${job.description}`,

`Source:Naukri`

]

.filter(Boolean)

.join("\n");


allJobs.push({

company:
job.company,

jobUrl:
job.jobLink,

jobText,

source:
"naukri"

});

}

await page.waitForTimeout(
2500
);

}
catch(err){

console.log(

`[Naukri] ${err.message}`

);

}

}

await context.close();

console.log(

`[Naukri] Scraped ${allJobs.length}`

);

return allJobs;

}

module.exports=
scrapeNaukri;