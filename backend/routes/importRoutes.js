const express =
require("express");

const router =
express.Router();

const importJobs =
require("../services/jobImportService");


router.post(

"/",

async(req,res)=>{

try{

await importJobs();

res.json({

message:
"Jobs imported"

});

}
catch(error){

console.log(
error
);

res.status(500)
.json({

message:
"Import failed"

});

}

}

);

module.exports =
router;