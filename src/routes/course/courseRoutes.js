const express = require("express");
const router = express.Router();

const courseController = require("../../controller/Course/courseController");

router.post("/create", courseController.createCourse);
router.get("/get", courseController.getCourses);
router.get("/get/:id", courseController.getCourseById);
router.put("/update/:id", courseController.updateCourse);
router.delete("/delete/:id", courseController.deleteCourse);
router.get("/get/slug/:slug", courseController.getCourseBySlug);

module.exports = router;
