const db = require('../../models');
const Instructor = db.Instructor;

const createInstructor = async (data) => {
    return await Instructor.create(data);
};

const getInstructors = async () => {
    return await Instructor.findAll({
        order: [['name', 'ASC']],
    });
};

const getInstructorById = async (id) => {
    return await Instructor.findByPk(id);
};

const updateInstructor = async (id, data) => {
    const instructor = await Instructor.findByPk(id);

    if (!instructor) {
        throw new Error('Instructor not found');
    }

    await instructor.update(data);

    return instructor;
};

const deleteInstructor = async (id) => {
    const instructor = await Instructor.findByPk(id);

    if (!instructor) {
        throw new Error('Instructor not found');
    }

    await instructor.destroy();

    return instructor;
};

module.exports = {
    createInstructor,
    getInstructors,
    getInstructorById,
    updateInstructor,
    deleteInstructor,
};