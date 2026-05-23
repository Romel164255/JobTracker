import {useEffect,useState} from "react";
import axios from "axios";

function App(){

const [jobs,setJobs]=useState([]);
const [decision,setDecision]=useState("APPLY");

async function fetchJobs(){

const response =
await axios.get(
`http://localhost:5000/api/job-list?decision=${decision}`
);

setJobs(response.data);

}

useEffect(()=>{

fetchJobs();

},[decision]);


return(

<div style={{padding:"20px"}}>

<h1>Job Tracker</h1>

<select
value={decision}
onChange={(e)=>setDecision(e.target.value)}
>

<option value="APPLY">
APPLY
</option>

<option value="SKIP">
SKIP
</option>

</select>


{jobs.map(job=>(

<div
key={job.id}
style={{
border:"1px solid gray",
padding:"10px",
margin:"10px"
}}
>

<h3>{job.company}</h3>

<p>{job.role}</p>

<p>{job.location}</p>

<p>{job.work_mode}</p>

<p>Score: {job.score}</p>

</div>

))}

</div>

);

}

export default App;