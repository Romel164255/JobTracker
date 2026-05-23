const express = require("express");

const router = express.Router();

const pool = require("../db/db");


router.get(

"/",

async(req,res)=>{

try{

const {

decision,
minScore

} = req.query;


let query =

`
SELECT

id,
company,
role,
location,
work_mode,
score,
decision,
created_at

FROM jobs

WHERE 1=1
`;


const values = [];


if(decision){

values.push(
decision
);

query +=

` AND decision=$${values.length}`;

}


if(minScore){

values.push(
parseInt(minScore)
);

query +=

` AND score >= $${values.length}`;

}


query +=

`
ORDER BY created_at DESC
`;


const result =

await pool.query(

query,
values

);


res.json(
result.rows
);

}
catch(error){

console.log(
error
);

res.status(500)
.json({

message:
"Error fetching jobs"

});

}

}

);


module.exports =
router;