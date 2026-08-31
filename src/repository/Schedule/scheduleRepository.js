const { Op } = require('sequelize');
const db = require('../../models');

const Schedule = db.Schedule;
const sequelize = db.sequelize;


// ============================================================
// CREATE
// ============================================================
const createSchedule = async (data) => {
    try {
        console.log("REPOSITORY DATA:", data);
        console.log(
            "REPOSITORY WEEKEND DATES:",
            data.weekend_dates
        );

        const weekendDates =
            Array.isArray(data.weekend_dates)
                ? data.weekend_dates
                : [];

        // Explicitly convert array to JSON string
        const weekendDatesJson =
            JSON.stringify(weekendDates);

        console.log(
            "JSON TO SAVE:",
            weekendDatesJson
        );

        const newSchedule = await Schedule.create({
            course: data.course,
            trainer_name: data.trainer_name,
            batch_start: data.batch_start,
            batch_end: data.batch_end,

            weekend_dates: weekendDatesJson,

            batch_type: data.batch_type,
            time_slot: data.time_slot,
            start_time: data.start_time,
            end_time: data.end_time,
            offer_price: data.offer_price,
            original_price: data.original_price,
            country: data.country,
            course_type: data.course_type,
            seats_left: data.seats_left,
            status: data.status
        });

        await newSchedule.reload();

        console.log(
            "DATABASE RESULT:",
            newSchedule.toJSON()
        );

        console.log(
            "DATABASE WEEKEND DATES:",
            newSchedule.weekend_dates
        );

        return newSchedule;

    } catch (error) {
        console.error(
            "CREATE REPOSITORY ERROR:",
            error
        );

        throw error;
    }
};


// ============================================================
// GET
// ============================================================
const getSchedule = async ({
    country,
    batch_type,
    time_slot,
    month,
    course_type,
    course
}) => {

    try {

        const where = {
            status: 'active',

            batch_start: {
                [Op.gte]: new Date()
            }
        };


        if (country) {
            where.country = country;
        }


        if (batch_type) {
            where.batch_type = batch_type;
        }


        if (course) {
            where.course = course;
        }


        if (course_type) {
            where.course_type = course_type;
        }


        if (time_slot) {
            where.time_slot = time_slot;
        }


        if (month) {

            const [
                year,
                monthNumber
            ] = month.split('-');


            const startDate =
                new Date(
                    Number(year),
                    Number(monthNumber) - 1,
                    1
                );


            const endDate =
                new Date(
                    Number(year),
                    Number(monthNumber),
                    1
                );


            where.batch_start = {
                [Op.gte]: startDate,
                [Op.lt]: endDate
            };
        }


        const schedules =
            await Schedule.findAll({
                where,
                order: [
                    ['batch_start', 'ASC']
                ]
            });


        return schedules;

    } catch (error) {

        console.error(
            'ERROR FETCHING SCHEDULES:',
            error
        );

        throw error;
    }
};


// ============================================================
// UPDATE
// ============================================================
const updateSchedule = async (id, data) => {
    try {
        console.log("UPDATE REPOSITORY ID:", id);
        console.log("UPDATE REPOSITORY DATA:", data);

        const schedule =
            await Schedule.findByPk(id);

        if (!schedule) {
            throw new Error("Schedule not found");
        }

        const weekendDates =
            Array.isArray(data.weekend_dates)
                ? data.weekend_dates
                : [];

        // Explicit JSON
        const weekendDatesJson =
            JSON.stringify(weekendDates);

        console.log(
            "UPDATE JSON TO SAVE:",
            weekendDatesJson
        );

        await schedule.update({
            course: data.course,
            trainer_name: data.trainer_name,
            batch_start: data.batch_start,
            batch_end: data.batch_end,

            weekend_dates: weekendDatesJson,

            batch_type: data.batch_type,
            time_slot: data.time_slot,
            start_time: data.start_time,
            end_time: data.end_time,
            offer_price: data.offer_price,
            original_price: data.original_price,
            country: data.country,
            course_type: data.course_type,
            seats_left: data.seats_left,
            status: data.status
        });

        await schedule.reload();

        console.log(
            "UPDATED DATABASE:",
            schedule.toJSON()
        );

        console.log(
            "UPDATED WEEKEND DATES:",
            schedule.weekend_dates
        );

        return schedule;

    } catch (error) {
        console.error(
            "UPDATE REPOSITORY ERROR:",
            error
        );

        throw error;
    }
};


// ============================================================
// DELETE
// ============================================================
const deleteSchedule = async (id) => {

    try {

        const schedule =
            await Schedule.findByPk(id);


        if (!schedule) {
            throw new Error(
                'Schedule not found'
            );
        }


        await schedule.destroy();

    } catch (error) {

        console.error(
            'ERROR DELETING SCHEDULE:',
            error
        );

        throw error;
    }
};


// ============================================================
// SINGLE SCHEDULE
// ============================================================
const getScheduleSingleData = async (
    course,
    country
) => {

    try {

        console.log(
            'Fetching single schedule:',
            course,
            country
        );


        const where = {

            status: 'active',

            batch_start: {
                [Op.gte]: new Date()
            },

            course: course,

            course_type: {
                [Op.in]: [
                    'Online',
                    'Premium Mentorship',
                    'Corporate'
                ]
            }
        };


        if (country) {
            where.country = country;
        }


        const schedules =
            await Schedule.findAll({
                where,
                order: [
                    ['batch_start', 'ASC']
                ]
            });


        const prices = {
            Online: null,
            'Premium Mentorship': null,
            Corporate: null
        };


        for (const schedule of schedules) {

            if (
                prices[
                    schedule.course_type
                ] === null
            ) {

                prices[
                    schedule.course_type
                ] = {

                    offer_price:
                        schedule.offer_price,

                    original_price:
                        schedule.original_price,

                    currency_symbol:
                        schedule.country === 'USA'
                            ? '$'
                            : '₹',

                    batch_start:
                        schedule.batch_start,

                    batch_end:
                        schedule.batch_end,

                    weekend_dates:
                        schedule.weekend_dates || [],

                    batch_type:
                        schedule.batch_type,

                    seats_left:
                        schedule.seats_left
                };
            }
        }


        return prices;

    } catch (error) {

        console.error(
            'ERROR FETCHING SINGLE SCHEDULE:',
            error
        );

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
