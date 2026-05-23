const { GoogleGenAI } =
require("@google/genai");

const profile =
require("../utils/profile");

const ai =
new GoogleGenAI({
    apiKey:
    process.env.GEMINI_API_KEY
});

async function analyzeJobAI(
jobText){

const prompt=`

Candidate profile:

Skills:
${profile.skills.join(",")}

Experience:
${profile.experience}

Target roles:
${profile.targetRoles.join(",")}

Projects:
- Node backend APIs
- PostgreSQL database work
- REST API projects
- Web development projects

Preferences:

- Small startups
- Junior roles
- Backend leaning roles
- Remote preferred

Analyze this job.

Return JSON only:

{
"score":0-100,
"decision":"APPLY/SKIP",
"matchedSkills":[],
"missingSkills":[],
"startupLikelihood":0-100,
"summary":"",
"reason":""
}

Job:

${jobText}

`;

const response=
await ai.models.generateContent({

model:
"gemini-2.5-flash",

contents:
prompt

});

return JSON.parse(
response.text
);

}

module.exports=
analyzeJobAI;