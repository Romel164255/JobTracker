const { getBrowser } =
require("../services/browserService");

const WELLFOUND_SEARCHES = [

"https://wellfound.com/jobs?role=full-stack-engineer&location=hyderabad-india",

"https://wellfound.com/jobs?role=backend-engineer&location=hyderabad-india",

"https://wellfound.com/jobs?role=software-engineer&location=hyderabad-india&remote=true",

"https://wellfound.com/jobs?role=full-stack-engineer&remote=true"

];

const MAX_JOBS_PER_URL = 5;


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

route=>route.abort()

);

const allJobs=[];

const seenKeys=
new Set();

try{

for(const url of WELLFOUND_SEARCHES){

console.log(
`[Wellfound] ${url}`
);

await page.goto(

url,

{

waitUntil:
"networkidle",

timeout:35000

}

);

await page.waitForTimeout(
2000
);

const jobs=

await page.evaluate(

(maxJobs)=>{

const results=[];

const cards=

document.querySelectorAll(

"[data-test='StartupResult'], div[class*='JobListing']"

);

let count=0;

for(const card of cards){

if(count>=maxJobs){

break;

}

const company=

card.querySelector("h2")
?.innerText;

const title=

card.querySelector("h3")
?.innerText;

const link=

card.querySelector("a")
?.href;

const description=

card.innerText;

if(company && title){

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
.toLowerCase();

if(seenKeys.has(key))
continue;

seenKeys.add(key);

allJobs.push({

company:
job.company,

jobUrl:
job.link,

jobText:

`
Company:${job.company}

Role:${job.title}

Description:

${job.description}

Source:Wellfound
`,

source:
"wellfound"

});

}

await page.waitForTimeout(
3000
);

}

}
catch(error){

console.log(
error.message
);

}

await context.close();

console.log(

`[Wellfound] Scraped ${allJobs.length}`

);

return allJobs;

}

module.exports=
scrapeWellfound;