const express = require("express");
const testimonialController = require("../../controller/Course/testimonialController");
const upload = require("../../middleware/upload");
const router = express.Router();

router.post('/create', upload('testimonials').single('image'), testimonialController.create);
router.get('/get', testimonialController.get);
router.get('/get/:id', testimonialController.getById);
router.put('/update/:id', upload('testimonials').single('image'), testimonialController.update);
router.delete('/delete/:id', testimonialController.deleteTestimonial);
router.post('/getByCountryAndCourse', testimonialController.getByCountryAndCourse);

module.exports = router;