require("../config/db");

const mongoose = require("mongoose");
//iam storing start time and end time of the booked format in the form of date object.
var eventschema = mongoose.Schema({
    name : String,
    contact : String,
    startDateTime : Date,
    endDateTime : Date
},{collection : "slotevents"})

module.exports = mongoose.model("slotevent",eventschema);