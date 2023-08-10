const mongoose = require("mongoose");

var eventschema = mongoose.Schema({
    name : String,
    contact : String,
    startDateTime : Date,
    endDateTime : Date,
    duration : Number
},{collection : "events"})

module.exports = mongoose.model("event",eventschema);