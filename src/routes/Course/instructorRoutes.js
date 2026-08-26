const express = require('express');
const instructorController = require('../../controller/Course/instructorController');
const upload = require('../../middleware/upload');
const router = express.Router();
const auth = require('../../middleware/auth');

router.post('/create', auth, upload('instructors').single('image'), instructorController.createInstructor);
router.get('/get', instructorController.getInstructors);
router.get('/get/:id',  instructorController.getInstructorById);
router.put('/update/:id', auth, upload('instructors').single('image'), instructorController.updateInstructor);
router.delete('/delete/:id', auth, instructorController.deleteInstructor);

module.exports = router;