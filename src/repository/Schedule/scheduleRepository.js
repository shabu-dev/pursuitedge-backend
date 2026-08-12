const { Op } = require('sequelize');
const db = require('../../models');

const Schedule = db.Schedule;
const sequelize = db.sequelize;

const createSchedule = async (course,trainer_name,batch_start,batch_end,batch_type,time_slot,start_time,end_time,offer_price,original_price,country,course_type,seats_left,status) => {
    try {
        const newSchedule = await Schedule.create({ course,trainer_name,batch_start,batch_end,batch_type,time_slot,start_time,end_time,offer_price,original_price,country,course_type,seats_left,status }); 
        return newSchedule;
    } catch (error) {
        console.error("Error creating schedule:", error);
        throw error;
    }

};

const getSchedule = async ({country, batch_type, time_slot,month,course_type}) => {
    try {
        const where = {status: 'active', batch_start  : { [Op.gte]: new Date() } };
        if (country) {
            where.country = country;
        }
        if (batch_type) {
            where.batch_type = batch_type;
        }
        if (time_slot) {
            where.time_slot = time_slot;
        }
        if (month) {
            const [year, monthNumber] = month.split("-");
            const startDate = new Date(Number(year),Number(monthNumber) - 1,1);
            const endDate = new Date(Number(year),Number(monthNumber),1);
            where.batch_start = {
                [sequelize.Op.gte]: startDate,
                [sequelize.Op.lt]: endDate
            };
        }
        const schedules = await Schedule.findAll({ where, order: [['batch_start', 'ASC']]  });
        return schedules;
    } catch (error) {
        console.error("Error fetching schedules:", error);
        throw error;
    }
};

const updateSchedule = async (id, updatedData) => {
    try {
        const schedule = await Schedule.findByPk(id);
        if (!schedule) {
            throw new Error("Schedule not found");
        }
        await schedule.update(updatedData);
        return schedule;
    } catch (error) {
        console.error("Error updating schedule:", error);
        throw error;
    }
};

const deleteSchedule = async (id) => {
    try {
        const schedule = await Schedule.findByPk(id);
        if (!schedule) {
            throw new Error("Schedule not found");
        }
        await schedule.destroy();
    } catch (error) {
        console.error("Error deleting schedule:", error);
        throw error;
    }
};  

const getScheduleSingleData = async (course,country) => {
    try {
        console.log("Fetching single schedule for course:", course, "and country:", country);
        const where = {
            status: 'active',
            batch_start: { [Op.gte]: new Date() },
            course: course,
            course_type: {
                [Op.in]: [
                    'Online',
                    'Premium Mentorship',
                    'Corporate',
                ],
            },
        };
        if (country) {
            where.country = country;
        }
        const schedules = await Schedule.findAll({ where, order: [['batch_start', 'ASC']]  });
        const prices = { Online: null, 'Premium Mentorship': null, Corporate: null,};
        for (const schedule of schedules) {
            if (prices[schedule.course_type] === null) {
                prices[schedule.course_type] = {
                offer_price: schedule.offer_price,
                original_price: schedule.original_price,
                currency_symbol:
                    schedule.country === 'USA' ? '$' : '₹',
                batch_start: schedule.batch_start,
                seats_left: schedule.seats_left,
                };
            }
        }
        return prices;
        
    } catch (error) {
        console.error("Error fetching single schedule:", error);
        throw error;
    }
};

module.exports = {
    createSchedule,
    getSchedule,
    updateSchedule,
    deleteSchedule,
    getScheduleSingleData
};