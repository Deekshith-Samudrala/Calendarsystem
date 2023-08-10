const express = require("express");
const app = express.Router();

app.use("/api/event", require("../Controller/EventController"));

module.exports = app;