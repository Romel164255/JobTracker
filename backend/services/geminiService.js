const { GoogleGenAI } = require("@google/genai");
const limiter = require("./rateLimiter");
const profile = require("../utils/profile");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

function parseGeminiJson(text) {
  const raw = String(text || "").trim();

  const withoutCodeFence = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    return JSON.parse(withoutCodeFence);
  } catch (_) {
    const start = withoutCodeFence.indexOf("{");
    const end = withoutCodeFence.lastIndexOf("}");

    if (start >= 0 && end > start) {
      return JSON.parse(withoutCodeFence.slice(start, end + 1));
    }

    throw new Error("Gemini response is not valid JSON");
  }
}

async function analyzeJobAI(jobText) {
  return limiter.schedule(async () => {
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    return parseGeminiJson(response.text);
  });
}

module.exports = analyzeJobAI;
