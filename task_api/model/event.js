require("../config/db");

const mongoose = require("mongoose");

var eventschema = mongoose.Schema({
    name : String,
    contact : String,
    startDateTime : Date,
    endDateTime : Date
},{collection : "slotevents"})

module.exports = mongoose.model("slotevent",eventschema);