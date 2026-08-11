require('dotenv').config();
const express = require("express");
const cors = require("cors");

//Login Routes 
const loginRoutes = require("./routes/login/loginRoutes");



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/login", loginRoutes);


module.exports = app;