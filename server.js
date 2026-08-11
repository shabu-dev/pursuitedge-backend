require("dotenv").config();

const express = require("express");
require("./src/config/db"); 
const app = require("./src/app");

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});