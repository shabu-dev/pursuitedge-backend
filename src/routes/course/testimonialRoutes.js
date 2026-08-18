const express = require("express");
const testimonialController = require("../../controller/Course/testimonialController");
const upload = require("../../middleware/upload");
const router = express.Router();
const auth = require('../../middleware/auth');

router.post('/create', auth, upload('testimonials').single('image'), testimonialController.create);
router.get('/get', auth, testimonialController.get);
router.get('/get/:id', auth, testimonialController.getById);
router.put('/update/:id', auth, upload('testimonials').single('image'), testimonialController.update);
router.delete('/delete/:id', auth, testimonialController.deleteTestimonial);
router.post('/getByCountryAndCourse', auth, testimonialController.getByCountryAndCourse);

module.exports = router;