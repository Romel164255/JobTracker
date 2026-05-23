function extractJobInfo(jobText){

const text =
jobText.toLowerCase();

const info = {

company:null,
role:null,
workMode:null,
location:null

};


const roles = [

"backend developer",
"frontend developer",
"full stack developer",
"node.js developer",
"react developer"

];


const workModes = [

"remote",
"hybrid",
"on-site",
"onsite"

];


const cities = [

"hyderabad",
"bangalore",
"bengaluru",
"mumbai",
"delhi",
"pune",
"chennai",
"kochi"

];


// Company extraction
const companyMatch =
jobText.match(
/company:\s*(.+?)(?=\s+(backend|frontend|full))/i
);

if(companyMatch){

info.company =
companyMatch[1]
.trim();

}


// Role extraction
roles.forEach(role=>{

if(
text.includes(role)
){

info.role =
role;

}

});


// Work mode extraction
workModes.forEach(mode=>{

if(
text.includes(mode)
){

info.workMode =
mode;

}

});


// Location extraction
let cityFound = false;


cities.forEach(city=>{

if(
text.includes(city)
){

info.location =
city;

cityFound = true;

}

});


// Remote fallback
if(

!cityFound &&

(

text.includes("remote") ||

text.includes("work from home")

)

){

info.location =
"Remote";

}


// Unknown fallback
if(!info.location){

info.location =
"Unknown";

}


return info;

}


module.exports =
extractJobInfo;