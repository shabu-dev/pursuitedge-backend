require('dotenv').config();
const express = require("express");
const cors = require("cors");

//Login Routes 
const loginRoutes = require("./routes/login/loginRoutes");

//Schedule Routes
const scheduleRoutes = require("./routes/Schedule/scheduleRoutes");



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/login", loginRoutes);

app.use("/api/schedule", scheduleRoutes);


module.exports = app;