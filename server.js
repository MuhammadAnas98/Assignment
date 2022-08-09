const express = require("express");
const router = require("./src/router");
const mysql = require("./src/configs/mysql")
const schedule = require("node-schedule");
const fileProcessingTask = require("./src/tasks/file-processing-status-check");

var app = express();

app.use(router)
app.listen(2000, function () {
    console.log("Started application on port %d", 2000)
});

mysql.runMysql();

schedule.scheduleJob('*/10 * * * *', fileProcessingTask);