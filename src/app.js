require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// Login Routes
const loginRoutes = require("./routes/login/loginRoutes");

// Schedule Routes
const scheduleRoutes = require("./routes/Schedule/scheduleRoutes");

// Course Routes
const courseRoutes = require("./routes/Course/courseRoutes");
const categoryRoutes = require("./routes/Course/categoryRoutes");
const instructorRoutes = require("./routes/Course/instructorRoutes");
const testimonialRoutes = require("./routes/Course/testimonialRoutes");

// Country Routes
const CountryRoutes = require("./routes/Country/countryRoutes");

// Blog
const blogRoutes = require("./routes/Blog/blogRoutes");

// Support
const supportRoutes = require("./routes/Support/supportRoutes");

// Contact
const contactRoutes = require("./routes/Contact/contactRoutes");

// Corporate
const corporateRoutes = require("./routes/Corporate/corporateRoutes");

const app = express();

/* =========================================================
   CORS CONFIGURATION
========================================================= */

const allowedOrigins = [
  "https://pursuitedge.com",
  "https://www.pursuitedge.com",

  // Local development
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without Origin header
    // Example: Postman, server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("CORS blocked origin:", origin);

    return callback(
      new Error(`CORS blocked for origin: ${origin}`)
    );
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};

// CORS middleware MUST be before routes
app.use(cors(corsOptions));

// Handle browser preflight requests
app.options(/.*/, cors(corsOptions));

/* =========================================================
   BODY PARSER
========================================================= */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* =========================================================
   STATIC FILES
========================================================= */

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

/* =========================================================
   API ROUTES
========================================================= */

// Login
app.use(
  "/api/login",
  loginRoutes
);

// Schedule
app.use(
  "/api/schedule",
  scheduleRoutes
);

// Course
app.use(
  "/api/course",
  courseRoutes
);

// Category
app.use(
  "/api/category",
  categoryRoutes
);

// Instructor
app.use(
  "/api/instructor",
  instructorRoutes
);

// Testimonial
app.use(
  "/api/testimonial",
  testimonialRoutes
);

// Country
app.use(
  "/api/country",
  CountryRoutes
);

// Blog
app.use(
  "/api/blog",
  blogRoutes
);

// Support
app.use(
  "/api/support",
  supportRoutes
);

// Contact
app.use(
  "/api/contact",
  contactRoutes
);

// Corporate
app.use(
  "/api/corporate",
  corporateRoutes
);

module.exports = app;