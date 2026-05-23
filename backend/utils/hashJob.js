const crypto = require("crypto");

function generateJobHash(
    company,
    role,
    location,
    jobText
){

    const normalizedText =

    jobText
    .toLowerCase()
    .replace(/\s+/g," ")
    .trim();


    const data =

    `${company}-${role}-${location}-${normalizedText}`;


    return crypto
    .createHash("sha256")
    .update(data)
    .digest("hex");

}

module.exports =
generateJobHash;