const aliases = {

"Node.js":["node.js","nodejs","node"],
"Express.js":["express.js","expressjs","express"],
"React":["react.js","reactjs","react"],
"PostgreSQL":["postgresql","postgres"],
"REST API":[
"rest api",
"rest apis",
"restful api",
"restful apis"
],
"JavaScript":["javascript"],
"TypeScript":["typescript"],
"Redis":["redis"]

};

const weights={

"Node.js":20,
"Express.js":15,
"REST API":15,
"JavaScript":15,
"React":10,
"PostgreSQL":10,
"Redis":10,
"TypeScript":5

};


function matchJob(jobText,profile){

let score=0;

const matched=[];
const missing=[];

const text=
jobText.toLowerCase();

profile.skills.forEach(skill=>{

const words=
aliases[skill] ||
[skill.toLowerCase()];

const found=
words.some(word=>{

const escaped=
word.replace(
/[.*+?^${}()|[\]\\]/g,
'\\$&'
);

const regex=
new RegExp(
`\\b${escaped}\\b`,
'i'
);

return regex.test(text);

});

if(found){

score +=
weights[skill] || 10;

matched.push(skill);

}else{

missing.push(skill);

}

});

return {

score:
Math.min(score,100),

apply:false,

matched,

missing

};

}

module.exports=
matchJob;