function detectFlags(jobText){

const text=jobText.toLowerCase();

const flags=[];

const rules=[

{
keyword:[
"fee",
"registration fee",
"pay for internship",
"training fee"
],
message:"Fee based role"
},

{
keyword:[
"senior",
"lead",
"principal"
],
message:"Senior role"
},

{
keyword:[
"relocate"
],
message:"Requires relocation"
}

];

rules.forEach(rule=>{

const found=
rule.keyword.some(
word=>text.includes(word)
);

if(found){

flags.push(
rule.message
);

}

});

return flags;

}

module.exports=detectFlags;