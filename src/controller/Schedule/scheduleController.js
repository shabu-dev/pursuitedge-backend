const scheduleRepository = require('../../repository/Schedule/scheduleRepository');


// ============================================================
// CREATE SCHEDULE
// ============================================================
const createSchedule = async (req, res) => {
    try {
        console.log("CREATE BODY:", req.body);

        const {
            course,
            trainer_name,
            batch_start,
            batch_end,
            weekend_dates,
            batch_type,
            time_slot,
            start_time,
            end_time,
            offer_price,
            original_price,
            country,
            course_type,
            seats_left,
            status
        } = req.body;

        // Convert weekend_dates to a guaranteed array
        let finalWeekendDates = [];

        if (batch_type === "Weekend") {
            if (!Array.isArray(weekend_dates)) {
                return res.status(400).json({
                    message: "weekend_dates must be an array"
                });
            }

            if (weekend_dates.length < 2) {
                return res.status(400).json({
                    message: "Please select at least two weekend dates"
                });
            }

            finalWeekendDates = weekend_dates.map(date => String(date));
        }

        if (batch_type === "Weekday") {
            finalWeekendDates = [];
        }

        const scheduleData = {
            course,
            trainer_name: trainer_name || null,
            batch_start,
            batch_end,
            weekend_dates: finalWeekendDates,
            batch_type,
            time_slot,
            start_time,
            end_time,
            offer_price,
            original_price,
            country,
            course_type,
            seats_left,
            status
        };

        console.log("FINAL DATA:", scheduleData);
        console.log("FINAL WEEKEND DATES:", finalWeekendDates);

        const result =
            await scheduleRepository.createSchedule(scheduleData);

        console.log(
            "SAVED RESULT:",
            result.toJSON()
        );

        return res.status(201).json({
            message: "Schedule created successfully",
            schedule: result
        });

    } catch (error) {
        console.error("CREATE ERROR:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};


// ============================================================
// GET SCHEDULES
// ============================================================
const getSchedule = async (req, res) => {
    try {

        const {
            country,
            batch_type,
            time_slot,
            month,
            course_type,
            course
        } = req.query;


        const schedules =
            await scheduleRepository.getSchedule({
                country,
                batch_type,
                time_slot,
                month,
                course_type,
                course
            });


        return res.status(200).json({
            message: 'Schedules fetched successfully',
            schedules
        });

    } catch (error) {

        console.error(
            'GET SCHEDULE ERROR:',
            error
        );

        return res.status(500).json({
            message: error.message
        });
    }
};


// ============================================================
// UPDATE SCHEDULE
// ============================================================
const updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("UPDATE ID:", id);
        console.log("UPDATE BODY:", req.body);

        const {
            course,
            trainer_name,
            batch_start,
            batch_end,
            weekend_dates,
            batch_type,
            time_slot,
            start_time,
            end_time,
            offer_price,
            original_price,
            country,
            course_type,
            seats_left,
            status
        } = req.body;

        let finalWeekendDates = [];

        if (batch_type === "Weekend") {
            if (!Array.isArray(weekend_dates)) {
                return res.status(400).json({
                    message: "weekend_dates must be an array"
                });
            }

            if (weekend_dates.length < 2) {
                return res.status(400).json({
                    message: "Please select at least two weekend dates"
                });
            }

            finalWeekendDates = weekend_dates.map(date => String(date));
        }

        if (batch_type === "Weekday") {
            finalWeekendDates = [];
        }

        const updatedData = {
            course,
            trainer_name: trainer_name || null,
            batch_start,
            batch_end,
            weekend_dates: finalWeekendDates,
            batch_type,
            time_slot,
            start_time,
            end_time,
            offer_price,
            original_price,
            country,
            course_type,
            seats_left,
            status
        };

        console.log(
            "FINAL UPDATE DATA:",
            updatedData
        );

        const result =
            await scheduleRepository.updateSchedule(
                id,
                updatedData
            );

        console.log(
            "UPDATED RESULT:",
            result.toJSON()
        );

        return res.status(200).json({
            message: "Schedule updated successfully",
            schedule: result
        });

    } catch (error) {
        console.error("UPDATE ERROR:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};


// ============================================================
// DELETE
// ============================================================
const deleteSchedule = async (req, res) => {
    try {

        const { id } = req.params;


        await scheduleRepository.deleteSchedule(id);


        return res.status(200).json({
            message: 'Schedule deleted successfully'
        });

    } catch (error) {

        console.error(
            'DELETE SCHEDULE ERROR:',
            error
        );

        return res.status(500).json({
            message: error.message
        });
    }
};


// ============================================================
// GET SINGLE SCHEDULE
// ============================================================
const getScheduleSingleData = async (req, res) => {
    try {

        const {
            course,
            country
        } = req.body;


        const schedule =
            await scheduleRepository.getScheduleSingleData(
                course,
                country
            );


        return res.status(200).json({
            message: 'Schedule fetched successfully',
            schedule
        });

    } catch (error) {

        console.error(
            'GET SINGLE SCHEDULE ERROR:',
            error
        );

        return res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createSchedule,
    getSchedule,
    updateSchedule,
    deleteSchedule,
    getScheduleSingleData
};
