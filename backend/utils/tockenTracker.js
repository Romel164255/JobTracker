let dailyTokens=0;

function addTokens(tokens){

dailyTokens+=tokens;

console.log(
"Tokens used:",
dailyTokens
);

if(
dailyTokens>500000
){

throw new Error(
"Daily token limit reached"
);

}

}

module.exports={
addTokens
};