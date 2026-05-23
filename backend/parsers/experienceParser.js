function extractExperience(jobText){

const text = jobText.toLowerCase();

const match = text.match(
/(\d+)\s*[-+]?\s*(\d+)?\s*years?/i
);

if(!match){

return null;

}

const minYears =
parseInt(match[1]);

const maxYears =
match[2]
? parseInt(match[2])
: minYears;

return {

minYears,
maxYears

};

}

module.exports=
extractExperience;