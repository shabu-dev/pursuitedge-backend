require('dotenv').config();
const express = require("express");
const cors = require("cors");

//Login Routes 
const loginRoutes = require("./routes/login/loginRoutes");

//Schedule Routes
const scheduleRoutes = require("./routes/Schedule/scheduleRoutes");

//Course Routes
const courseRoutes = require("./routes/course/courseRoutes");



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/login", loginRoutes);

app.use("/api/schedule", scheduleRoutes);

app.use("/api/course", courseRoutes);

module.exports = app;