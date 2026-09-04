const express = require("express");
const router = express.Router();
const courseController = require("../../controller/Course/courseController");
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');

router.post("/create", auth, courseController.createCourse);
router.get("/get",  courseController.getCourses);
router.get("/get/slug/:slug",  courseController.getCourseBySlug);
router.get("/get/:id", courseController.getCourseById);
router.put("/update/:id", auth, courseController.updateCourse);
router.delete("/delete/:id", auth, courseController.deleteCourse);
router.put("/hero-image", upload('course').single('image'), courseController.updateCourseHeroImage);
router.get('/search', courseController.searchCourses);
router.get('/popular', courseController.getPopularCourses);

router.get('/get/category-wise/:slug', courseController.getCategoryWiseCourses);

router.get('/get/count/category-wise-count',courseController.getCategoryWiseCount);

module.exports = router;
