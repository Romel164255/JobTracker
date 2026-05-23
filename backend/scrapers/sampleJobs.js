// backend/scrapers/sampleJobs.js

const jobs = [

{

id:"sample-001",

company:"STYLZ",

role:"Backend Developer",

location:"Hyderabad",

workMode:"on-site",

experience:"0-2 years",

skills:[
"Node.js",
"Express",
"MongoDB",
"REST APIs"
],

source:"sample",

jobUrl:
"https://sample.com/stylz-backend",

description:
`
Backend Developer role for junior engineers.

Requirements:

- Node.js
- Express
- MongoDB
- REST APIs

Freshers can apply.
`

},

{

id:"sample-002",

company:"TechNova",

role:"Frontend Developer",

location:"Remote",

workMode:"remote",

experience:"0-1 years",

skills:[
"React",
"JavaScript",
"TypeScript"
],

source:"sample",

jobUrl:
"https://sample.com/technova-frontend",

description:
`
Frontend role focused on React.

Requirements:

- React
- JavaScript
- TypeScript

Remote work available.
`

},

{

id:"sample-003",

company:"DataAI",

role:"Backend Developer",

location:"Bengaluru",

workMode:"on-site",

experience:"1-2 years",

skills:[
"Python",
"Django",
"REST APIs"
],

source:"sample",

jobUrl:
"https://sample.com/dataai-backend",

description:
`
Backend developer role.

Requirements:

- Python
- Django
- REST APIs

Experience preferred:
1-2 years.
`

}

];

const normalizedJobs =

jobs.map(job=>({

...job,

jobText:[

`Company:${job.company}`,

`Role:${job.role}`,

`Location:${job.location}`,

`Work Mode:${job.workMode}`,

`Experience:${job.experience}`,

`Skills Required:${job.skills.join(", ")}`,

`Description:${job.description}`,

`Source:${job.source}`

]

.filter(Boolean)

.join("\n")

}));


module.exports =
normalizedJobs;