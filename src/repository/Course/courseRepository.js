const db = require('../../models');

const Course = db.Course;
const sequelize = db.sequelize;

const createCourse = async ({ id, slug, title, name }) => {
    try {
        const newCourse = await Course.create({ id, slug, title, name });
        return newCourse;
    } catch (error) {
        console.error("Error creating course:", error);
        throw error;
    }
};

const getCourses = async () => {
    try {
        const courses = await Course.findAll();
        return courses;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

const getCourseById = async (id) => {
    try {
        const course = await Course.findByPk(id);
        return course;
    } catch (error) {
        console.error("Error fetching course by ID:", error);
        throw error;
    }
};

const updateCourse = async (id, updatedData) => {
    try {
        const course = await Course.findByPk(id);   
        if (!course) {
            throw new Error("Course not found");
        }
        await course.update(updatedData);   
        return course;
    } catch (error) {
        console.error("Error updating course:", error);
        throw error;
    }
};

const deleteCourse = async (id) => {
    try {
        const course = await Course.findByPk(id);
        if (!course) {
            throw new Error("Course not found");
        }
        await course.destroy();
    } catch (error) {
        console.error("Error deleting course:", error);
        throw error;
    }
};

const getCourseBySlug = async (slug) => {
    try {
        const course = await Course.findOne({ where: { slug } });
        return course;
    } catch (error) {
        console.error("Error fetching course by slug:", error);
        throw error;
    }
};

module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getCourseBySlug
};
