// backend/services/browserService.js

const { chromium } =
require("playwright");

let browser = null;

async function getBrowser(){

try{

if(!browser){

console.log(
"[Browser] Launching shared browser..."
);

browser =

await chromium.launch({

headless:true,

args:[

"--no-sandbox",

"--disable-setuid-sandbox",

"--disable-blink-features=AutomationControlled",

"--disable-dev-shm-usage"

]

});

}

return browser;

}
catch(error){

console.error(

"[Browser] Launch failed:",

error.message

);

throw error;

}

}


async function closeBrowser(){

try{

if(browser){

console.log(
"[Browser] Closing browser..."
);

await browser.close();

browser = null;

}

}
catch(error){

console.error(

"[Browser] Close error:",

error.message

);

}

}

module.exports={

getBrowser,
closeBrowser

};