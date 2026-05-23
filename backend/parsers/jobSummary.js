function createSummary(result){

return {

matchScore: result.score,

decision:
result.apply
? "APPLY"
: "SKIP",

matchedSkills:
result.matched,

missingSkills:
result.missing,

redFlags:
result.flags || [],

experience:
result.experience || null,

reason:
result.reason || "Good match"

};

}

module.exports=
createSummary;