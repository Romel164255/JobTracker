const { GoogleGenAI } =
require("@google/genai");

const limiter =
require("./rateLimiter");

const profile =
require("../utils/profile");

const ai =
new GoogleGenAI({

apiKey:
process.env.GEMINI_API_KEY

});


async function analyzeJobAI(
jobText
){

return limiter.schedule(

async()=>{

const prompt = `

Candidate skills:
${profile.skills.join(",")}

Target roles:
${profile.targetRoles.join(",")}

Experience:
${profile.experience}

Preference:
Small startups
Backend roles
Junior roles

Analyze:

${jobText}

Return JSON only:

{
"score":0-100,
"decision":"APPLY/SKIP",
"matchedSkills":[],
"missingSkills":[],
"reason":"",
"summary":""
}

`;

const response =

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

);

}

module.exports =
analyzeJobAI;