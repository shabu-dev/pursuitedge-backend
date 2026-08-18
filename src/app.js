require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require('path');


//Login Routes 
const loginRoutes = require("./routes/login/loginRoutes");

//Schedule Routes
const scheduleRoutes = require("./routes/Schedule/scheduleRoutes");

//Course Routes
const courseRoutes = require("./routes/course/courseRoutes");
const categoryRoutes = require("./routes/course/categoryRoutes");
const instructorRoutes = require('./routes/Course/instructorRoutes');
const testimonialRoutes = require('./routes/course/testimonialRoutes');

//Country Routes
const CountryRoutes = require("./routes/Country/countryRoutes");

//Blog 
const blogRoutes = require("./routes/Blog/blogRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/login", loginRoutes);

app.use("/api/schedule", scheduleRoutes);

app.use("/api/course", courseRoutes);
app.use("/api/category", categoryRoutes);


app.use('/api/instructor', instructorRoutes);
app.use('/api/testimonial', testimonialRoutes);



// Country
app.use('/api/country',CountryRoutes);

//Blog
app.use("/api/blog", blogRoutes);

module.exports = app;