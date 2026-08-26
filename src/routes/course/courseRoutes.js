const express = require("express");
const router = express.Router();
const courseController = require("../../controller/Course/courseController");
const auth = require('../../middleware/auth');

router.post("/create", auth, courseController.createCourse);
router.get("/get", courseController.getCourses);
router.get("/get/slug/:slug", courseController.getCourseBySlug);
router.get("/get/:id", courseController.getCourseById);
router.put("/update/:id", courseController.updateCourse);
router.delete("/delete/:id", courseController.deleteCourse);


module.exports = router;
