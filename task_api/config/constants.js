const start = "10AM";
const end = "05PM"; // only working until 06PM have to check why thats happening
const slotduration = 30; 
const timezone = "UTC"; // Data is taken in UTC and store in database according to UTC time zone

module.exports = {start,end,slotduration,timezone};