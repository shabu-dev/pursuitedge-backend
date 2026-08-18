const express = require("express");
const router = express.Router();
const scheduleController = require("../../controller/Schedule/scheduleController");
const auth = require('../../middleware/auth');


router.post("/create", auth, scheduleController.createSchedule);
router.get("/get", auth, scheduleController.getSchedule);
router.put("/update/:id", auth, scheduleController.updateSchedule);
router.delete("/delete/:id", auth, scheduleController.deleteSchedule);
router.post("/getSingleData",  auth, scheduleController.getScheduleSingleData);

module.exports = router;