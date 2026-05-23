const express =
require("express");

const router =
express.Router();

const analyzeJob =
require("../services/jobService");


router.post(
"/analyze-job",

async(req,res)=>{

try{

const { jobText } =
req.body;


const result =
await analyzeJob(
jobText
);


res.json(
result
);

}
catch(error){

console.log(
error
);

res.status(500)
.json({

message:
"Server Error"

});

}

}

);


module.exports =
router;