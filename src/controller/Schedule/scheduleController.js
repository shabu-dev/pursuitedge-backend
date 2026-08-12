const scheduleRepository = require('../../repository/Schedule/scheduleRepository');

const createSchedule = async (req, res) => {
    try {
        const { course,trainer_name,batch_start,batch_end,batch_type,time_slot,start_time,end_time,offer_price,original_price,country,course_type,seats_left,status} = req.body;

        if(!course || !batch_start || !batch_end || !batch_type || !time_slot || !start_time || !end_time || !offer_price || !original_price || !country || !course_type || !seats_left || !status) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const result = await scheduleRepository.createSchedule(course,trainer_name,batch_start,batch_end,batch_type,time_slot,start_time,end_time,offer_price,original_price,country,course_type,seats_left,status);
        res.status(201).json({ message: "Schedule created successfully", schedule: result });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getSchedule = async (req, res) => {
    try {
        const {country, batch_type, time_slot,month,course_type} = req.query;
        const schedules = await scheduleRepository.getSchedule({country, batch_type, time_slot,month,course_type});
        res.status(200).json({ message: "Schedules fetched successfully", schedules });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { course,trainer_name,batch_start,batch_end,batch_type,time_slot,start_time,end_time,offer_price,original_price,country,course_type,seats_left,status} = req.body;

        const result = await scheduleRepository.updateSchedule(id, { course,trainer_name,batch_start,batch_end,batch_type,time_slot,start_time,end_time,offer_price,original_price,country,course_type,seats_left,status });
        res.status(200).json({ message: "Schedule updated successfully", schedule: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        await scheduleRepository.deleteSchedule(id);
        res.status(200).json({ message: "Schedule deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSchedule,
    getSchedule,
    updateSchedule,
    deleteSchedule
};  
