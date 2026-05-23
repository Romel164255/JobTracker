const express = require("express");

const cors = require("cors");

require("dotenv").config();

const app = express();


// Middleware
app.use(cors());

app.use(express.json());


// Routes
const jobRoutes =
require("./routes/jobRoutes");

const jobListRoutes =
require("./routes/jobListRoutes");

const importRoutes =
require("./routes/importRoutes");


app.use(
"/api/jobs",
jobRoutes
);

app.use(
"/api/job-list",
jobListRoutes
);

app.use(
"/api/import",
importRoutes
);

// Server
const PORT =
process.env.PORT || 5000;


app.listen(

PORT,

()=>{

console.log(
`Server running on ${PORT}`
);

}

);