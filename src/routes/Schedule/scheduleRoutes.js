const express = require("express");
const router = express.Router();

const scheduleController = require("../../controller/Schedule/scheduleController");

router.post("/create", scheduleController.createSchedule);
router.get("/get", scheduleController.getSchedule);
router.put("/update/:id", scheduleController.updateSchedule);
router.delete("/delete/:id", scheduleController.deleteSchedule);

module.exports = router;