const express = require("express");
const router = express.Router();
const courseController = require("../../controller/Course/courseController");
const auth = require('../../middleware/auth');

router.post("/create", auth, courseController.createCourse);
router.get("/get", auth, courseController.getCourses);
router.get("/get/slug/:slug", auth, courseController.getCourseBySlug);
router.get("/get/:id", auth, courseController.getCourseById);
router.put("/update/:id", auth, courseController.updateCourse);
router.delete("/delete/:id", auth, courseController.deleteCourse);


module.exports = router;
